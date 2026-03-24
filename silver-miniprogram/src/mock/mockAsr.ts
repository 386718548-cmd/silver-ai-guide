import type { AsrResult } from '../types/index'
import type { AsrService } from '../types/services'

const MOCK_ASR_TEXTS = [
  '帮我查一下阿莫西林怎么吃',
  '布洛芬可以和感冒药一起吃吗',
  '帮我设置明天早上八点吃药提醒',
  '这个药有什么副作用',
  '我头疼应该吃什么药',
  '提醒我每天晚上九点吃降压药',
]

export const mockAsrService: AsrService = {
  startRecording(): void {
    // Mock: 无需实际操作
    console.log('[MockASR] 开始录音')
  },

  async stopRecording(): Promise<AsrResult> {
    // 模拟识别延迟 1-3 秒
    const delay = Math.floor(Math.random() * 2000) + 1000
    await new Promise(resolve => setTimeout(resolve, delay))

    // 模拟 10% 失败率
    if (Math.random() < 0.1) {
      return {
        text: '',
        confidence: 0.1,
        success: false,
      }
    }

    const text = MOCK_ASR_TEXTS[Math.floor(Math.random() * MOCK_ASR_TEXTS.length)]
    return {
      text,
      confidence: 0.7 + Math.random() * 0.3,
      success: true,
    }
  },
}
