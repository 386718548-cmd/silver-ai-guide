import type { MedicationInfo, ChatMessage } from '../types/index'
import type { LlmService } from '../types/services'

const LLM_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'
const API_KEY = import.meta.env.VITE_DASHSCOPE_API_KEY || ''

const PARSE_MED_TIMEOUT = 10000
const CHAT_TIMEOUT = 8000

const PARSE_SYSTEM_PROMPT = `你是一位专业的药剂师助手，专门为老年人解读药品说明书。
请从以下OCR识别的药品说明书文字中，提取并用简单易懂的语言（不超过200字）总结：
1. 药品名称
2. 适应症（这个药治什么病）
3. 用法用量（怎么吃、吃多少）
4. 禁忌事项（哪些人不能吃）
5. 是否为处方药

请以JSON格式返回，字段：name, indications, dosage, contraindications, isPrescription`

const CHAT_SYSTEM_PROMPT = `你是一位专业的健康顾问，专门为老年人提供健康咨询。
请用简单易懂的语言回答问题，回答不超过150字。
如果涉及用药问题，请提醒用户遵医嘱。`

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ])
}

async function callQwen(messages: Array<{ role: string; content: string }>, timeout: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), timeout)
    uni.request({
      url: LLM_API_URL,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      data: {
        model: 'qwen-turbo',
        input: { messages },
        parameters: { result_format: 'message' },
      },
      success: (res: any) => {
        clearTimeout(timer)
        const content = res.data?.output?.choices?.[0]?.message?.content
        if (content) {
          resolve(content)
        } else {
          reject(new Error('Empty response from LLM'))
        }
      },
      fail: (err: any) => {
        clearTimeout(timer)
        reject(new Error(err.errMsg || 'LLM request failed'))
      },
    })
  })
}

export const llmService: LlmService = {
  async parseMedication(ocrText: string): Promise<MedicationInfo> {
    const messages = [
      { role: 'system', content: PARSE_SYSTEM_PROMPT },
      { role: 'user', content: ocrText },
    ]

    const raw = await withTimeout(callQwen(messages, PARSE_MED_TIMEOUT), PARSE_MED_TIMEOUT)

    try {
      // 尝试解析 JSON
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          name: parsed.name || '未知药品',
          indications: parsed.indications || '',
          dosage: parsed.dosage || '',
          contraindications: parsed.contraindications || '',
          isPrescription: Boolean(parsed.isPrescription),
          rawText: ocrText,
          createdAt: Date.now(),
        }
      }
    } catch {
      // JSON 解析失败，返回原始文本
    }

    return {
      name: '药品信息',
      indications: raw.slice(0, 50),
      dosage: '请参考说明书',
      contraindications: '请遵医嘱',
      isPrescription: false,
      rawText: ocrText,
      createdAt: Date.now(),
    }
  },

  async chat(messages: ChatMessage[]): Promise<string> {
    const apiMessages = [
      { role: 'system', content: CHAT_SYSTEM_PROMPT },
      ...messages.slice(-5).map(m => ({ role: m.role, content: m.content })),
    ]

    return withTimeout(callQwen(apiMessages, CHAT_TIMEOUT), CHAT_TIMEOUT)
  },
}
