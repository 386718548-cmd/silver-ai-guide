import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Reminder, CreateReminderDto, ReminderCompletion } from '../types/index'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
const SNOOZE_MINUTES = 15

function generateId(): string {
  return `reminder_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function cleanOldCompletions(reminder: Reminder): Reminder {
  const cutoff = Date.now() - THIRTY_DAYS_MS
  return {
    ...reminder,
    completions: reminder.completions.filter(c => c.completedAt >= cutoff),
  }
}

export const useReminderStore = defineStore('reminder', () => {
  // 从本地存储加载，并清理过期记录
  const saved = getStorage<Reminder[]>(STORAGE_KEYS.SILVER_REMINDERS) || []
  const reminders = ref<Reminder[]>(saved.map(cleanOldCompletions))

  function persist(): void {
    setStorage(STORAGE_KEYS.SILVER_REMINDERS, reminders.value)
  }

  async function createReminder(dto: CreateReminderDto): Promise<void> {
    // 验证时间 > 当前时间（对于 once 类型）
    if (dto.repeatType === 'once') {
      const [hours, minutes] = dto.time.split(':').map(Number)
      const now = new Date()
      const reminderDate = new Date()
      reminderDate.setHours(hours, minutes, 0, 0)
      if (reminderDate <= now) {
        throw new Error('提醒时间不能早于当前时间')
      }
    }

    const reminder: Reminder = {
      ...dto,
      id: generateId(),
      createdAt: Date.now(),
      subscribed: false,
      completions: [],
    }

    reminders.value.push(reminder)
    persist()
  }

  function toggleReminder(id: string): void {
    const reminder = reminders.value.find(r => r.id === id)
    if (reminder) {
      reminder.enabled = !reminder.enabled
      persist()
    }
  }

  function completeReminder(id: string): void {
    const reminder = reminders.value.find(r => r.id === id)
    if (!reminder) return

    const completion: ReminderCompletion = {
      scheduledAt: Date.now(),
      completedAt: Date.now(),
      status: 'completed',
    }
    reminder.completions.push(completion)

    // 清理 30 天外记录
    const cutoff = Date.now() - THIRTY_DAYS_MS
    reminder.completions = reminder.completions.filter(c => c.completedAt >= cutoff)

    persist()
  }

  function snoozeReminder(id: string): void {
    const reminder = reminders.value.find(r => r.id === id)
    if (!reminder) return

    const snoozeTime = Date.now() + SNOOZE_MINUTES * 60 * 1000
    const completion: ReminderCompletion = {
      scheduledAt: Date.now(),
      completedAt: snoozeTime,
      status: 'snoozed',
    }
    reminder.completions.push(completion)
    persist()
  }

  function deleteReminder(id: string): void {
    const idx = reminders.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      reminders.value.splice(idx, 1)
      persist()
    }
  }

  return {
    reminders,
    createReminder,
    toggleReminder,
    completeReminder,
    snoozeReminder,
    deleteReminder,
  }
})
