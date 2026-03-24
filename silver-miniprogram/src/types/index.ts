// 药品信息
export interface MedicationInfo {
  name: string
  indications: string
  dosage: string
  contraindications: string
  isPrescription: boolean
  rawText: string
  createdAt: number
}

// 提醒完成记录
export interface ReminderCompletion {
  scheduledAt: number
  completedAt: number
  status: 'completed' | 'snoozed' | 'missed'
}

// 提醒
export interface Reminder {
  id: string
  name: string
  time: string // HH:mm
  repeatType: 'once' | 'daily' | 'weekly' | 'custom'
  repeatDays?: number[] // 0-6
  note?: string
  enabled: boolean
  subscribed: boolean
  createdAt: number
  completions: ReminderCompletion[]
}

// 对话消息
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// 应用设置
export interface AppSettings {
  autoSpeak: boolean
  ttsSpeed: number
  fontSize: 'normal' | 'large' | 'xlarge'
  dialectMode: DialectMode
  companionAutoTts: boolean
  theme: ThemeId
}

// OCR 结果
export interface OcrResult {
  text: string
  confidence: number
  success: boolean
}

// ASR 结果
export interface AsrResult {
  text: string
  confidence: number
  success: boolean
}

// 创建提醒 DTO
export type CreateReminderDto = Omit<Reminder, 'id' | 'createdAt' | 'completions' | 'subscribed'>

// 方言模式
export type DialectMode = 'mandarin' | 'cantonese' | 'hokkien' | 'sichuan'

// 主题 ID
export type ThemeId = 'nature' | 'traditional' | 'modern' | 'ink'

// 主题配置
export interface ThemeConfig {
  id: ThemeId
  name: string
  vars: Record<string, string>
}

// 伴聊消息
export interface CompanionMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// 用户画像
export interface UserProfile {
  preferredTopics: string[]
}

// 紧急联系人
export interface Contact {
  id: string
  name: string
  phone: string
  relation: string
  createdAt: number
}

// 创建联系人 DTO
export type CreateContactDto = Omit<Contact, 'id' | 'createdAt'>

// 位置信息
export interface LocationInfo {
  latitude: number
  longitude: number
  address: string
  success: boolean
}

// 通知结果
export interface NotifyResult {
  contactId: string
  contactName: string
  success: boolean
  failReason?: string
}

// SOS 记录
export interface SosRecord {
  id: string
  triggeredAt: number
  location: LocationInfo
  notifyResults: NotifyResult[]
  status: 'success' | 'partial' | 'failed'
}
