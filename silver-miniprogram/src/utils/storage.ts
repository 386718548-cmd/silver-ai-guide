// 存储 Key 常量
export const STORAGE_KEYS = {
  SILVER_REMINDERS: 'silver_reminders',
  SILVER_MED_HISTORY: 'silver_med_history',
  SILVER_CHAT_HISTORY: 'silver_chat_history',
  SILVER_SETTINGS: 'silver_settings',
  SILVER_SUBSCRIPTION: 'silver_subscription',
  SILVER_THEME: 'silver_theme',
  SILVER_DIALECT_MODE: 'silver_dialect_mode',
  SILVER_COMPANION_HISTORY: 'silver_companion_history',
  SILVER_COMPANION_PROFILE: 'silver_companion_profile',
  SILVER_CONTACTS: 'silver_contacts',
  SILVER_SOS_RECORDS: 'silver_sos_records',
} as const

export function getStorage<T>(key: string): T | null {
  try {
    const value = uni.getStorageSync(key)
    if (value === '' || value === null || value === undefined) return null
    return value as T
  } catch {
    return null
  }
}

export function setStorage<T>(key: string, value: T): void {
  try {
    uni.setStorageSync(key, value)
  } catch {
    console.error(`[storage] setStorage failed for key: ${key}`)
  }
}

export function removeStorage(key: string): void {
  try {
    uni.removeStorageSync(key)
  } catch {
    console.error(`[storage] removeStorage failed for key: ${key}`)
  }
}
