import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CompanionMessage, UserProfile } from '../types/index'
import { companionLlmService } from '../services/companionLlm'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'

const MAX_HISTORY = 50

export const useCompanionStore = defineStore('companion', () => {
  const messages = ref<CompanionMessage[]>([])
  const loading = ref(false)
  const userProfile = ref<UserProfile>({ preferredTopics: [] })

  function loadHistory(): void {
    const saved = getStorage<CompanionMessage[]>(STORAGE_KEYS.SILVER_COMPANION_HISTORY)
    if (saved && Array.isArray(saved)) {
      messages.value = saved.slice(-MAX_HISTORY)
    }
    const profile = getStorage<UserProfile>(STORAGE_KEYS.SILVER_COMPANION_PROFILE)
    if (profile) userProfile.value = profile
  }

  function saveHistory(): void {
    setStorage(STORAGE_KEYS.SILVER_COMPANION_HISTORY, messages.value.slice(-MAX_HISTORY))
  }

  function addMessage(role: 'user' | 'assistant', content: string): CompanionMessage {
    const msg: CompanionMessage = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      role,
      content,
      timestamp: Date.now(),
    }
    messages.value.push(msg)
    // 超出上限时移除最旧记录
    if (messages.value.length > MAX_HISTORY) {
      messages.value = messages.value.slice(-MAX_HISTORY)
    }
    saveHistory()
    return msg
  }

  async function sendMessage(content: string): Promise<void> {
    if (!content.trim()) return
    addMessage('user', content)

    // 更新话题偏好
    if (!userProfile.value.preferredTopics.includes(content) && content.length < 20) {
      userProfile.value.preferredTopics = [
        content,
        ...userProfile.value.preferredTopics,
      ].slice(0, 10)
      setStorage(STORAGE_KEYS.SILVER_COMPANION_PROFILE, userProfile.value)
    }

    loading.value = true
    try {
      const reply = await companionLlmService.chat(messages.value, userProfile.value)
      addMessage('assistant', reply)
    } catch {
      addMessage('assistant', '网络不稳定，请稍后再试')
    } finally {
      loading.value = false
    }
  }

  async function sendTopicPrompt(topic: string): Promise<void> {
    await sendMessage(topic)
  }

  async function initGreeting(): Promise<void> {
    if (messages.value.length > 0) return
    const greeting = await companionLlmService.generateGreeting()
    addMessage('assistant', greeting)
  }

  function clearHistory(): void {
    messages.value = []
    saveHistory()
  }

  return {
    messages,
    loading,
    userProfile,
    loadHistory,
    sendMessage,
    sendTopicPrompt,
    initGreeting,
    clearHistory,
  }
})
