<template>
  <view
    v-if="!hidden"
    class="floating-mic"
    :class="{ recording: isRecording, processing: isProcessing }"
    @touchstart.prevent="onTouchStart"
    @touchend.prevent="onTouchEnd"
    @touchcancel.prevent="onTouchEnd"
  >
    <view class="mic-icon">
      <text class="mic-emoji">{{ isRecording ? '🔴' : isProcessing ? '⏳' : '🎤' }}</text>
    </view>
    <view v-if="isRecording" class="pulse-ring" />
    <view v-if="showHint" class="hint-toast">请长按说话</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useVoiceStore } from '../stores/voice'
import { dialectAsrService } from '../services/dialectAsr'
import { STORAGE_KEYS } from '../utils/storage'
import type { DialectMode } from '../types/index'

interface Props {
  hidden?: boolean
}

withDefaults(defineProps<Props>(), {
  hidden: false,
})

const emit = defineEmits<{
  (e: 'recordStart'): void
  (e: 'recordEnd'): void
  (e: 'recordTooShort'): void
}>()

const voiceStore = useVoiceStore()
const { isRecording, isProcessing } = storeToRefs(voiceStore)

const showHint = ref(false)
let touchTimer: ReturnType<typeof setTimeout> | null = null
let touchStartTime = 0
let activeDialectMode: DialectMode | null = null
const LONG_PRESS_THRESHOLD = 500

function getCurrentDialectMode(): DialectMode {
  try {
    const saved = uni.getStorageSync(STORAGE_KEYS.SILVER_DIALECT_MODE) as DialectMode | ''
    if (saved && saved !== '') return saved
  } catch {
    // ignore
  }
  return 'mandarin'
}

function onTouchStart(): void {
  touchStartTime = Date.now()
  touchTimer = setTimeout(() => {
    const mode = getCurrentDialectMode()
    activeDialectMode = mode

    if (mode === 'mandarin') {
      voiceStore.startRecord()
    } else {
      voiceStore.isRecording = true
      voiceStore.errorMessage = ''
      dialectAsrService.startRecording(mode)
    }
    emit('recordStart')
  }, LONG_PRESS_THRESHOLD)
}

async function onTouchEnd(): Promise<void> {
  const duration = Date.now() - touchStartTime

  if (touchTimer) {
    clearTimeout(touchTimer)
    touchTimer = null
  }

  if (duration < LONG_PRESS_THRESHOLD) {
    showHint.value = true
    setTimeout(() => {
      showHint.value = false
    }, 1500)
    emit('recordTooShort')
    return
  }

  if (!isRecording.value) return

  const mode = activeDialectMode ?? 'mandarin'
  activeDialectMode = null

  if (mode === 'mandarin') {
    voiceStore.stopRecord()
  } else {
    voiceStore.isRecording = false
    voiceStore.isProcessing = true
    voiceStore.errorMessage = ''

    try {
      const result = await dialectAsrService.stopRecording()

      if (result.fallback) {
        voiceStore.errorMessage = '方言识别暂不可用，已切换为普通话识别'
        voiceStore.isProcessing = false
        return
      }

      if (!result.success || result.confidence < 0.5 || !result.text.trim()) {
        voiceStore.errorMessage = '没有听清，请再说一遍'
        voiceStore.isProcessing = false
        return
      }

      await voiceStore.handleAsrResult(result.text)
    } catch {
      voiceStore.errorMessage = '识别失败，请重试'
      voiceStore.isProcessing = false
    }
  }

  emit('recordEnd')
}
</script>

<style scoped>
.floating-mic {
  position: fixed;
  right: 40rpx;
  bottom: 60rpx;
  width: 110px;
  height: 110px;
  min-width: 110px;
  min-height: 110px;
  border-radius: 50%;
  background: #4CAF50;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  transition: background 0.2s;
}

.floating-mic.recording {
  background: #f44336;
}

.floating-mic.processing {
  background: #FF9800;
}

.mic-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mic-emoji {
  font-size: 48rpx;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid rgba(244, 67, 54, 0.5);
  animation: pulse 1s ease-out infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.hint-toast {
  position: absolute;
  bottom: 130%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  white-space: nowrap;
}
</style>
