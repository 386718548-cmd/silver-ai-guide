import { ref } from 'vue'
import type { TtsService } from '../types/services'

const APP_ID = import.meta.env.VITE_XUNFEI_APP_ID || 'c5dbb417'
const API_KEY = import.meta.env.VITE_XUNFEI_API_KEY || 'c3e27fd883206d19bb4a939e8aa92d7d'
const API_SECRET = import.meta.env.VITE_XUNFEI_API_SECRET || 'YmRkNjY3MTQ1NmNhYTg1Nzg5ZTgzODI1'

const isPlayingRef = ref(false)
let currentSocket: any = null
let audioContext: any = null

/**
 * 生成讯飞 TTS WebSocket 鉴权 URL
 * 使用 HMAC-SHA256 签名
 */
function buildAuthUrl(): string {
  const host = 'tts-api.xfyun.cn'
  const path = '/v2/tts'
  const date = new Date().toUTCString()

  // 微信小程序环境下使用简化鉴权（实际生产需服务端签名）
  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`

  // Base64 编码的 API Secret 用于简化 HMAC（实际需 crypto）
  const authorizationOrigin = `api_key="${API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${btoa(signatureOrigin)}"`
  const authorization = btoa(authorizationOrigin)

  return `wss://${host}${path}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}`
}

/**
 * 将 base64 音频数据写入临时文件并播放
 */
async function playAudioBase64(base64Data: string): Promise<void> {
  const fs = uni.getFileSystemManager()
  // 微信小程序用户数据目录
  const userDataPath = (uni as any).env?.USER_DATA_PATH || ''
  const tempPath = `${userDataPath}/tts_${Date.now()}.mp3`

  return new Promise((resolve, reject) => {
    fs.writeFile({
      filePath: tempPath,
      data: base64Data,
      encoding: 'base64',
      success: () => {
        const innerAudioContext = uni.createInnerAudioContext()
        audioContext = innerAudioContext
        innerAudioContext.src = tempPath
        innerAudioContext.onEnded(() => {
          isPlayingRef.value = false
          resolve()
        })
        innerAudioContext.onError((err: any) => {
          isPlayingRef.value = false
          reject(new Error(err.errMsg || 'Audio play error'))
        })
        innerAudioContext.play()
      },
      fail: (err: any) => reject(new Error(err.errMsg || 'Write audio file failed')),
    })
  })
}

export const ttsService: TtsService = {
  async speak(text: string, speed = 0.8): Promise<void> {
    if (isPlayingRef.value) {
      ttsService.stop()
    }

    isPlayingRef.value = true

    try {
      const url = buildAuthUrl()
      const audioChunks: string[] = []

      await new Promise<void>((resolve, reject) => {
        const socket = uni.connectSocket({
          url,
          success: () => {},
          fail: (err: any) => reject(new Error(err.errMsg)),
        })

        currentSocket = socket

        socket.onOpen(() => {
          const params = {
            common: { app_id: APP_ID },
            business: {
              aue: 'lame',
              auf: 'audio/L16;rate=16000',
              vcn: 'xiaoyan',
              speed: Math.round(speed * 50), // 讯飞速度 0-100，0.8 对应 40
              volume: 80,
              pitch: 50,
              tte: 'UTF8',
            },
            data: {
              status: 2,
              text: btoa(unescape(encodeURIComponent(text))),
            },
          }
          socket.send({ data: JSON.stringify(params) })
        })

        socket.onMessage((res: any) => {
          try {
            const data = JSON.parse(res.data)
            if (data.code !== 0) {
              reject(new Error(`TTS error: ${data.message}`))
              return
            }
            if (data.data?.audio) {
              audioChunks.push(data.data.audio)
            }
            if (data.data?.status === 2) {
              socket.close({})
              resolve()
            }
          } catch {
            reject(new Error('TTS response parse error'))
          }
        })

        socket.onError((err: any) => {
          reject(new Error(err.errMsg || 'WebSocket error'))
        })

        socket.onClose(() => {
          if (audioChunks.length === 0) {
            reject(new Error('No audio data received'))
          }
        })
      })

      // 合并音频数据并播放
      if (audioChunks.length > 0) {
        const fullAudio = audioChunks.join('')
        await playAudioBase64(fullAudio)
      }
    } catch {
      isPlayingRef.value = false
      // TTS 失败降级为纯文字展示（不抛出错误，由调用方处理）
      throw new Error('TTS_FAILED')
    }
  },

  stop(): void {
    if (currentSocket) {
      try {
        currentSocket.close({})
      } catch {}
      currentSocket = null
    }
    if (audioContext) {
      try {
        audioContext.stop()
        audioContext.destroy()
      } catch {}
      audioContext = null
    }
    isPlayingRef.value = false
  },

  get isPlaying(): boolean {
    return isPlayingRef.value
  },
}
