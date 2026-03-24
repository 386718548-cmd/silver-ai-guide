import type { OcrResult, AsrResult, MedicationInfo, ChatMessage, Reminder, CreateReminderDto } from './index'

export interface OcrService {
  recognize(imageBase64: string): Promise<OcrResult>
}

export interface LlmService {
  parseMedication(ocrText: string): Promise<MedicationInfo>
  chat(messages: ChatMessage[]): Promise<string>
}

export interface TtsService {
  speak(text: string, speed?: number): Promise<void>
  stop(): void
  readonly isPlaying: boolean
}

export interface AsrService {
  startRecording(): void
  stopRecording(): Promise<AsrResult>
}

export interface ReminderService {
  create(reminder: CreateReminderDto): Promise<Reminder>
  list(): Reminder[]
  complete(id: string): void
  snooze(id: string, minutes: number): void
  delete(id: string): void
}
