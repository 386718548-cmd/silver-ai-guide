import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SosRecord } from '../types/index'
import { sosService } from '../services/sosService'
import { useContactStore } from './contactStore'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'

type SosStatus = 'idle' | 'countdown' | 'triggering' | 'locating' | 'notifying' | 'done' | 'partial'

const MAX_DISPLAY = 20
const CLEANUP_DAYS = 90
const COUNTDOWN_SECONDS = 10

export const useSosStore = defineStore('sos', () => {
  const status = ref<SosStatus>('idle')
  const countdown = ref(0)
  const records = ref<SosRecord[]>([])
  const lastRecord = ref<SosRecord | null>(null)
  let timer: ReturnType<typeof setInterval> | null = null

  // 按时间倒序，最多 20 条
  const displayRecords = computed(() =>
    [...records.value]
      .sort((a, b) => b.triggeredAt - a.triggeredAt)
      .slice(0, MAX_DISPLAY)
  )

  function loadRecords(): void {
    const saved = getStorage<SosRecord[]>(STORAGE_KEYS.SILVER_SOS_RECORDS) ?? []
    records.value = saved
    cleanOldRecords()
  }

  function cleanOldRecords(): void {
    const cutoff = Date.now() - CLEANUP_DAYS * 24 * 60 * 60 * 1000
    records.value = records.value.filter(r => r.triggeredAt >= cutoff)
    setStorage(STORAGE_KEYS.SILVER_SOS_RECORDS, records.value)
  }

  function startCountdown(): void {
    if (status.value !== 'idle') return
    status.value = 'countdown'
    countdown.value = COUNTDOWN_SECONDS

    timer = setInterval(() => {
      uni.vibrateShort({ type: 'medium' })
      countdown.value -= 1
      if (countdown.value <= 0) {
        clearInterval(timer!)
        timer = null
        confirmTrigger()
      }
    }, 1000)
  }

  function cancel(): void {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    status.value = 'idle'
    countdown.value = 0
  }

  async function confirmTrigger(): Promise<void> {
    const contactStore = useContactStore()
    contactStore.load()

    status.value = 'triggering'
    try {
      status.value = 'locating'
      const record = await sosService.trigger(contactStore.contacts)
      records.value.push(record)
      setStorage(STORAGE_KEYS.SILVER_SOS_RECORDS, records.value)
      lastRecord.value = record
      status.value = record.status === 'success' ? 'done' : 'partial'
    } catch {
      status.value = 'partial'
    }
  }

  function reset(): void {
    status.value = 'idle'
    countdown.value = 0
    lastRecord.value = null
  }

  return {
    status,
    countdown,
    records,
    displayRecords,
    lastRecord,
    loadRecords,
    cleanOldRecords,
    startCountdown,
    cancel,
    confirmTrigger,
    reset,
  }
})
