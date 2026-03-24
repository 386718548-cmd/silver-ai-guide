import type { AsrResult } from '../types/index'
import type { AsrService } from '../types/services'

const ASR_TIMEOUT = 3000

let recorderManager: WechatMiniprogram.RecorderManager | null = null
let resolveRecording: ((result: AsrResult) => void) | null = null
let rejectRecording: ((err: Error) => void) | null = null
let recordingTimer: ReturnType<typeof setTimeout> | null = null

function getRecorderManager(): WechatMiniprogram.RecorderManager {
  if (!recorderManager) {
    recorderManager = wx.getRecorderManager()

    recorderManager.onStop((res) => {
      if (recordingTimer) {
        clearTimeout(recordingTimer)
        recordingTimer = null
      }
      if (res.tempFilePath && resolveRecording) {
        // 使用微信内置语音识别（需要开通相关权限）
        // 此处简化处理：直接返回成功，实际需调用 ASR API
        resolveRecording({
          text: '语音识别结果',
          confidence: 0.8,
          success: true,
        })
        resolveRecording = null
      }
    })

    recorderManager.onError((err) => {
      if (recordingTimer) {
        clearTimeout(recordingTimer)
        recordingTimer = null
      }
      if (rejectRecording) {
        rejectRecording(new Error(err.errMsg || 'Recording error'))
        rejectRecording = null
      }
    })
  }
  return recorderManager
}

export const asrService: AsrService = {
  startRecording(): void {
    const manager = getRecorderManager()
    manager.start({
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'mp3',
    })
  },

  stopRecording(): Promise<AsrResult> {
    return new Promise((resolve, reject) => {
      resolveRecording = resolve
      rejectRecording = reject

      const manager = getRecorderManager()
      manager.stop()

      // 3 秒超时
      recordingTimer = setTimeout(() => {
        resolveRecording = null
        rejectRecording = null
        resolve({
          text: '',
          confidence: 0,
          success: false,
        })
      }, ASR_TIMEOUT)
    })
  },
}
