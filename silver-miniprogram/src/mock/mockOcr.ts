import type { OcrResult } from '../types/index'
import type { OcrService } from '../types/services'

const MOCK_OCR_TEXTS = [
  '阿莫西林胶囊 规格：0.25g 用法用量：口服，成人一次0.5g，每6-8小时一次。适应症：用于敏感菌所致的感染。禁忌：青霉素过敏者禁用。',
  '布洛芬缓释胶囊 规格：0.3g 用法用量：口服，成人一次1粒，每12小时一次。适应症：用于缓解轻至中度疼痛。禁忌：活动性消化道溃疡禁用。',
  '复方丹参片 规格：每片含丹参提取物 用法用量：口服，一次3片，一日3次。适应症：活血化瘀，理气止痛。禁忌：孕妇慎用。',
]

function randomDelay(min = 1000, max = 3000): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const mockOcrService: OcrService = {
  async recognize(_imageBase64: string): Promise<OcrResult> {
    await randomDelay(1000, 3000)

    // 模拟 20% 失败率
    const shouldFail = Math.random() < 0.2
    if (shouldFail) {
      return {
        text: '',
        confidence: 0.2,
        success: false,
      }
    }

    const text = MOCK_OCR_TEXTS[Math.floor(Math.random() * MOCK_OCR_TEXTS.length)]
    const confidence = 0.6 + Math.random() * 0.4 // 0.6 - 1.0

    return {
      text,
      confidence,
      success: true,
    }
  },
}
