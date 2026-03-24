import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MedicationInfo } from '../types/index'
import { mockOcrService } from '../mock/mockOcr'
import { mockLlmService } from '../mock/mockLlm'
import { mockTtsService } from '../mock/mockTts'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'

type MedicationStatus = 'idle' | 'capturing' | 'ocr' | 'llm' | 'done' | 'error'

const OCR_TIMEOUT = 5000
const LLM_TIMEOUT = 10000
const TTS_SPEED = 0.8

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ])
}

export const useMedicationStore = defineStore('medication', () => {
  const status = ref<MedicationStatus>('idle')
  const ocrText = ref('')
  const medicationInfo = ref<MedicationInfo | null>(null)
  const errorMessage = ref('')

  async function startCapture(): Promise<void> {
    if (status.value !== 'idle' && status.value !== 'error') return

    status.value = 'capturing'
    errorMessage.value = ''

    try {
      // 检查网络
      const networkInfo = await new Promise<UniApp.GetNetworkTypeSuccess>((resolve, reject) => {
        uni.getNetworkType({
          success: resolve,
          fail: reject,
        })
      })
      if (networkInfo.networkType === 'none') {
        throw new Error('network_unavailable')
      }

      // 调用相机/相册
      const mediaResult = await new Promise<UniApp.ChooseImageSuccessCallbackResult>((resolve, reject) => {
        uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['camera', 'album'],
          success: resolve,
          fail: reject,
        })
      })

      const imagePath = mediaResult.tempFilePaths[0]
      if (!imagePath) {
        status.value = 'idle'
        return
      }

      // 读取图片为 base64
      const fileContent = await new Promise<string>((resolve, reject) => {
        uni.getFileSystemManager().readFile({
          filePath: imagePath,
          encoding: 'base64',
          success: (res) => resolve(res.data as string),
          fail: reject,
        })
      })

      // OCR 识别
      status.value = 'ocr'
      let ocrResult
      try {
        ocrResult = await withTimeout(mockOcrService.recognize(fileContent), OCR_TIMEOUT)
      } catch (e: unknown) {
        const err = e as Error
        if (err.message === 'timeout') {
          throw new Error('ocr_timeout')
        }
        throw e
      }

      if (!ocrResult.success || ocrResult.confidence < 0.6) {
        throw new Error('ocr_low_quality')
      }

      ocrText.value = ocrResult.text

      // LLM 解析
      status.value = 'llm'
      let medInfo
      try {
        medInfo = await withTimeout(mockLlmService.parseMedication(ocrResult.text), LLM_TIMEOUT)
      } catch (e: unknown) {
        const err = e as Error
        if (err.message === 'timeout') {
          throw new Error('llm_timeout')
        }
        throw e
      }

      medicationInfo.value = medInfo

      // 保存历史记录
      const history = getStorage<MedicationInfo[]>(STORAGE_KEYS.SILVER_MED_HISTORY) || []
      history.unshift(medInfo)
      if (history.length > 10) history.splice(10)
      setStorage(STORAGE_KEYS.SILVER_MED_HISTORY, history)

      status.value = 'done'

      // 跳转到结果页
      uni.navigateTo({ url: '/pages/medication/result' })
    } catch (e: unknown) {
      const err = e as Error
      status.value = 'error'
      if (err.message === 'network_unavailable') {
        errorMessage.value = '当前网络不可用，请检查网络后重试'
      } else if (err.message === 'ocr_timeout') {
        errorMessage.value = '识别超时，请重试'
      } else if (err.message === 'ocr_low_quality') {
        errorMessage.value = '识别失败，请重新拍摄清晰图片'
      } else if (err.message === 'llm_timeout') {
        errorMessage.value = 'AI 解析超时，请稍后重试'
      } else {
        // 用户取消选图
        status.value = 'idle'
        errorMessage.value = ''
      }
    }
  }

  function retry(): void {
    status.value = 'idle'
    errorMessage.value = ''
  }

  async function speakResult(): Promise<void> {
    if (!medicationInfo.value) return
    const info = medicationInfo.value
    const text = `${info.name}。适应症：${info.indications}。用法用量：${info.dosage}。注意事项：${info.contraindications}`
    await mockTtsService.speak(text, TTS_SPEED)
  }

  return {
    status,
    ocrText,
    medicationInfo,
    errorMessage,
    startCapture,
    retry,
    speakResult,
  }
})
