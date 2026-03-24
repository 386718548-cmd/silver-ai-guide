import type { DialectMode, AsrResult } from '../types/index'
import { asrService } from './asr'

// 讯飞 ASR 配置
const XFYUN_APPID = 'c5dbb417'
const XFYUN_API_KEY = 'c3e27fd883206d19bb4a939e8aa92d7d'
const XFYUN_ASR_URL = 'https://iat-api.xfyun.cn/v2/iat'

// 方言模式 → 讯飞语言代码映射
export const DIALECT_LANG_MAP: Record<DialectMode, string> = {
  mandarin: 'zh_cn',
  cantonese: 'zh_yue',
  hokkien: 'zh_min',
  sichuan: 'zh_sc',
}

const DIALECT_ASR_TIMEOUT = 8000

let recorderManager: WechatMiniprogram.RecorderManager | null = null
let currentMode: DialectMode = 'mandarin'
let resolveRecording: ((result: AsrResult & { fallback?: boolean }) => void) | null = null
let recordingTimer: ReturnType<typeof setTimeout> | null = null

function getRecorderManager(): WechatMiniprogram.RecorderManager {
  if (!recorderManager) {
    recorderManager = wx.getRecorderManager()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recorderManager.onStop((res: any) => {
      if (res.tempFilePath) {
        handleRecordingComplete(res.tempFilePath)
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recorderManager.onError((err: any) => {
      if (recordingTimer) {
        clearTimeout(recordingTimer)
        recordingTimer = null
      }
      if (resolveRecording) {
        resolveRecording({ text: '', confidence: 0, success: false, fallback: true })
        resolveRecording = null
      }
      console.error('[dialectAsr] recorder error:', err.errMsg)
    })
  }
  return recorderManager
}

/**
 * 将字符串编码为 Base64（小程序兼容方案）
 */
function strToBase64(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let output = ''
  const bytes = Array.from(str).map((c) => c.charCodeAt(0))
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i]
    const b1 = bytes[i + 1] ?? 0
    const b2 = bytes[i + 2] ?? 0
    output += chars[b0 >> 2]
    output += chars[((b0 & 3) << 4) | (b1 >> 4)]
    output += i + 1 < bytes.length ? chars[((b1 & 15) << 2) | (b2 >> 6)] : '='
    output += i + 2 < bytes.length ? chars[b2 & 63] : '='
  }
  return output
}

/**
 * 调用讯飞方言 ASR HTTP API
 * 注意：实际生产环境建议通过后端代理调用，避免在客户端暴露密钥
 */
function callXfyunAsr(filePath: string): Promise<AsrResult> {
  return new Promise((resolve) => {
    const curTime = String(Math.floor(Date.now() / 1000))
    const langCode = DIALECT_LANG_MAP[currentMode]
    const paramStr = JSON.stringify({
      engine_type: 'sms16k',
      aue: 'raw',
      language: langCode,
    })
    const paramBase64 = strToBase64(paramStr)

    wx.uploadFile({
      url: XFYUN_ASR_URL,
      filePath,
      name: 'audio',
      header: {
        'X-Appid': XFYUN_APPID,
        'X-CurTime': curTime,
        'X-Param': paramBase64,
        'X-CheckSum': XFYUN_API_KEY,
        'Content-Type': 'multipart/form-data',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      success: (res: any) => {
        try {
          const data: {
            code: number
            data?: {
              result?: {
                ws?: Array<{ cw: Array<{ w: string }> }>
              }
            }
          } = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
          if (data.code === 0 && data.data?.result?.ws) {
            const text = data.data.result.ws
              .map((w) => w.cw.map((c) => c.w).join(''))
              .join('')
            resolve({ text, confidence: text ? 0.85 : 0, success: !!text })
          } else {
            resolve({ text: '', confidence: 0, success: false })
          }
        } catch {
          resolve({ text: '', confidence: 0, success: false })
        }
      },
      fail: () => {
        resolve({ text: '', confidence: 0, success: false })
      },
    })
  })
}

/**
 * 录音完成后的处理逻辑
 */
async function handleRecordingComplete(filePath: string): Promise<void> {
  if (!resolveRecording) return

  const resolve = resolveRecording
  resolveRecording = null

  if (recordingTimer) {
    clearTimeout(recordingTimer)
    recordingTimer = null
  }

  const result = await callXfyunAsr(filePath)

  if (result.success) {
    resolve({ ...result, fallback: false })
  } else {
    // 方言识别失败，标记降级
    resolve({ text: '', confidence: 0, success: false, fallback: true })
  }
}

export const dialectAsrService = {
  startRecording(mode: DialectMode): void {
    currentMode = mode

    // 普通话模式直接使用现有服务
    if (mode === 'mandarin') {
      asrService.startRecording()
      return
    }

    const manager = getRecorderManager()
    manager.start({
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'mp3',
    })
  },

  stopRecording(): Promise<AsrResult & { fallback?: boolean }> {
    // 普通话模式直接使用现有服务
    if (currentMode === 'mandarin') {
      return asrService.stopRecording()
    }

    return new Promise((resolve) => {
      resolveRecording = resolve

      const manager = getRecorderManager()
      manager.stop()

      // 8 秒超时，自动降级
      recordingTimer = setTimeout(() => {
        if (!resolveRecording) return
        const res = resolveRecording
        resolveRecording = null
        res({ text: '', confidence: 0, success: false, fallback: true })
      }, DIALECT_ASR_TIMEOUT)
    })
  },
}
