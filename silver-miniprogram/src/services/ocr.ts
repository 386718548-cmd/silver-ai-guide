import type { OcrResult } from '../types/index'
import type { OcrService } from '../types/services'

const OCR_TIMEOUT = 5000
const OCR_API_URL = 'https://ocr.tencentcloudapi.com/'

// 腾讯云 OCR 配置（通过环境变量注入）
const SECRET_ID = import.meta.env.VITE_TENCENT_SECRET_ID || ''
const SECRET_KEY = import.meta.env.VITE_TENCENT_SECRET_KEY || ''

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ])
}

async function requestOcr(imageBase64: string): Promise<OcrResult> {
  const timestamp = Math.floor(Date.now() / 1000)
  const payload = JSON.stringify({
    ImageBase64: imageBase64,
  })

  return new Promise((resolve, reject) => {
    uni.request({
      url: OCR_API_URL,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'X-TC-Action': 'GeneralBasicOCR',
        'X-TC-Version': '2018-11-19',
        'X-TC-Region': 'ap-guangzhou',
        'X-TC-Timestamp': String(timestamp),
        'Authorization': `TC3-HMAC-SHA256 SecretId=${SECRET_ID}`,
      },
      data: payload,
      success: (res: any) => {
        const data = res.data
        if (data?.Response?.TextDetections) {
          const texts = data.Response.TextDetections.map((t: any) => t.DetectedText).join('\n')
          const confidence = data.Response.TextDetections.length > 0 ? 0.85 : 0.0
          resolve({
            text: texts,
            confidence,
            success: texts.length > 0,
          })
        } else {
          resolve({ text: '', confidence: 0, success: false })
        }
      },
      fail: (err: any) => reject(new Error(err.errMsg || 'OCR request failed')),
    })
  })
}

export const ocrService: OcrService = {
  async recognize(imageBase64: string): Promise<OcrResult> {
    try {
      return await withTimeout(requestOcr(imageBase64), OCR_TIMEOUT)
    } catch (e: unknown) {
      const err = e as Error
      if (err.message === 'timeout') throw new Error('timeout')
      throw e
    }
  },
}
