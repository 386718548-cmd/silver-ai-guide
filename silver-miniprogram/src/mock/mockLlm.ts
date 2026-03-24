import type { MedicationInfo, ChatMessage } from '../types/index'
import type { LlmService } from '../types/services'

function randomDelay(min = 500, max = 2000): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, ms))
}

const MOCK_MEDICATIONS: MedicationInfo[] = [
  {
    name: '阿莫西林胶囊',
    indications: '用于敏感菌引起的感染，如扁桃体炎、肺炎等。',
    dosage: '口服，成人每次0.5克，每6至8小时一次，饭后服用。',
    contraindications: '青霉素过敏者禁用。肾功能不全者需减量。',
    isPrescription: true,
    rawText: '',
    createdAt: Date.now(),
  },
  {
    name: '布洛芬缓释胶囊',
    indications: '用于缓解轻至中度疼痛，如头痛、牙痛、关节痛。',
    dosage: '口服，成人每次1粒，每12小时一次，饭后服用。',
    contraindications: '活动性消化道溃疡禁用。孕妇及哺乳期妇女慎用。',
    isPrescription: false,
    rawText: '',
    createdAt: Date.now(),
  },
  {
    name: '复方丹参片',
    indications: '活血化瘀，理气止痛，用于胸闷、心绞痛。',
    dosage: '口服，一次3片，一日3次，饭后服用。',
    contraindications: '孕妇慎用。出血性疾病患者禁用。',
    isPrescription: false,
    rawText: '',
    createdAt: Date.now(),
  },
]

const MOCK_CHAT_ANSWERS = [
  '您好！根据您的问题，建议您按时服药，如有不适请及时就医。',
  '这个问题很重要。请遵医嘱用药，不要自行增减剂量。',
  '您可以在饭后服用，这样可以减少对胃的刺激。如有疑问请咨询医生。',
  '健康提醒：规律作息、均衡饮食对健康很重要。如需设置提醒，请告诉我。',
  '我理解您的担心。建议您定期复查，保持良好的生活习惯。',
]

export const mockLlmService: LlmService = {
  async parseMedication(ocrText: string): Promise<MedicationInfo> {
    await randomDelay(800, 2000)
    const med = MOCK_MEDICATIONS[Math.floor(Math.random() * MOCK_MEDICATIONS.length)]
    return {
      ...med,
      rawText: ocrText,
      createdAt: Date.now(),
    }
  },

  async chat(_messages: ChatMessage[]): Promise<string> {
    await randomDelay(500, 1500)
    return MOCK_CHAT_ANSWERS[Math.floor(Math.random() * MOCK_CHAT_ANSWERS.length)]
  },
}
