import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChatMessage } from '../types/index'
import { mockAsrService } from '../mock/mockAsr'
import { mockLlmService } from '../mock/mockLlm'
import { mockTtsService } from '../mock/mockTts'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'

const MAX_MESSAGES = 10
const TTS_SPEED = 0.8
const LLM_TIMEOUT = 8000

// 提醒意图关键词
const REMINDER_INTENT_KEYWORDS = ['设置提醒', '帮我提醒', '提醒我', '定个提醒', '设个提醒']

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ])
}

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function detectReminderIntent(text: string): boolean {
  return REMINDER_INTENT_KEYWORDS.some(kw => text.includes(kw))
}

export const useVoiceStore = defineStore('voice', () => {
  const isRecording = ref(false)
  const isProcessing = ref(false)
  const errorMessage = ref('')

  // 从本地存储加载历史
  const savedMessages = getStorage<ChatMessage[]>(STORAGE_KEYS.SILVER_CHAT_HISTORY) || []
  const messages = ref<ChatMessage[]>(savedMessages.slice(-MAX_MESSAGES))

  function addMessage(msg: ChatMessage): void {
    messages.value.push(msg)
    if (messages.value.length > MAX_MESSAGES) {
      messages.value = messages.value.slice(-MAX_MESSAGES)
    }
    setStorage(STORAGE_KEYS.SILVER_CHAT_HISTORY, messages.value)
  }

  function startRecord(): void {
    if (isRecording.value || isProcessing.value) return
    isRecording.value = true
    errorMessage.value = ''
    mockAsrService.startRecording()
  }

  /**
   * 处理 ASR 识别文字，调用 LLM 并播报结果
   * 供 stopRecord 和方言识别路径共用
   */
  async function handleAsrResult(text: string): Promise<void> {
    // 添加用户消息
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }
    addMessage(userMsg)

    // 检测提醒意图
    if (detectReminderIntent(text)) {
      isProcessing.value = false
      uni.navigateTo({ url: '/pages/reminder/create' })
      return
    }

    // LLM 回答
    let answer: string
    try {
      answer = await withTimeout(
        mockLlmService.chat(messages.value),
        LLM_TIMEOUT
      )
    } catch (e: unknown) {
      const err = e as Error
      if (err.message === 'timeout') {
        errorMessage.value = 'AI 思考中，请稍候'
      } else {
        errorMessage.value = 'AI 回答失败，请重试'
      }
      isProcessing.value = false
      return
    }

    const aiMsg: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: answer,
      timestamp: Date.now(),
    }
    addMessage(aiMsg)

    // TTS 播报
    mockTtsService.speak(answer, TTS_SPEED).catch(() => {
      // TTS 失败静默处理
    })

    isProcessing.value = false
  }

  async function stopRecord(): Promise<void> {
    if (!isRecording.value) return
    isRecording.value = false
    isProcessing.value = true
    errorMessage.value = ''

    try {
      const asrResult = await mockAsrService.stopRecording()

      if (!asrResult.success || asrResult.confidence < 0.5 || !asrResult.text.trim()) {
        errorMessage.value = '没有听清，请再说一遍'
        isProcessing.value = false
        return
      }

      await handleAsrResult(asrResult.text)
    } finally {
      isProcessing.value = false
    }
  }

  return {
    isRecording,
    isProcessing,
    messages,
    errorMessage,
    startRecord,
    stopRecord,
    handleAsrResult,
  }
})
