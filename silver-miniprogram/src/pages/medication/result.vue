<template>
  <view class="page">
    <view v-if="info" class="content">
      <!-- 药品名称 -->
      <view class="section name-section">
        <text class="drug-name">{{ info.name }}</text>
        <view v-if="info.isPrescription" class="prescription-badge">
          <text class="badge-text">处方药</text>
        </view>
      </view>

      <!-- 处方药警示 -->
      <view v-if="info.isPrescription" class="warning-box">
        <text class="warning-text">⚠️ 请遵医嘱，勿自行用药</text>
      </view>

      <!-- 适应症 -->
      <view class="section">
        <text class="section-title">适应症</text>
        <text class="section-body">{{ info.indications }}</text>
      </view>

      <!-- 用法用量 -->
      <view class="section">
        <text class="section-title">用法用量</text>
        <text class="section-body">{{ info.dosage }}</text>
      </view>

      <!-- 注意事项 -->
      <view class="section">
        <text class="section-title">注意事项</text>
        <text class="section-body">{{ info.contraindications }}</text>
      </view>

      <!-- 操作按钮 -->
      <view class="actions">
        <button class="action-btn secondary-btn" @tap="onRetake">
          <text class="btn-text">重新拍照</text>
        </button>
        <button
          class="action-btn primary-btn"
          :class="{ playing: ttsPlaying }"
          @tap="onToggleTts"
        >
          <text class="btn-text">{{ ttsPlaying ? '停止播报' : '语音播报' }}</text>
        </button>
      </view>

      <!-- TTS 失败提示 -->
      <ErrorToast :message="ttsError" @close="ttsError = ''" />
    </view>

    <view v-else class="empty">
      <text class="empty-text">暂无药品信息</text>
      <button class="action-btn secondary-btn" @tap="onRetake">返回重新拍照</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMedicationStore } from '../../stores/medication'
import { mockTtsService } from '../../mock/mockTts'
import { getStorage, STORAGE_KEYS } from '../../utils/storage'
import type { AppSettings } from '../../types/index'
import ErrorToast from '../../components/ErrorToast.vue'

const medicationStore = useMedicationStore()
const info = medicationStore.medicationInfo
const ttsPlaying = ref(false)
const ttsError = ref('')

const TTS_SPEED = 0.8

onMounted(async () => {
  const settings = getStorage<AppSettings>(STORAGE_KEYS.SILVER_SETTINGS)
  const autoSpeak = settings?.autoSpeak !== false // 默认 true
  if (autoSpeak && info) {
    await triggerTts()
  }
})

async function triggerTts(): Promise<void> {
  if (!info) return
  try {
    ttsPlaying.value = true
    const text = `${info.name}。适应症：${info.indications}。用法用量：${info.dosage}。注意事项：${info.contraindications}`
    await mockTtsService.speak(text, TTS_SPEED)
  } catch {
    ttsError.value = '语音播报暂不可用，请阅读文字内容'
  } finally {
    ttsPlaying.value = false
  }
}

async function onToggleTts(): Promise<void> {
  if (ttsPlaying.value) {
    mockTtsService.stop()
    ttsPlaying.value = false
    return
  }
  await triggerTts()
}

function onRetake(): void {
  mockTtsService.stop()
  medicationStore.retry()
  uni.navigateBack()
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 32rpx;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-wrap: wrap;
}

.drug-name {
  font-size: 43px;
  font-weight: bold;
  color: #1a1a1a;
}

.prescription-badge {
  background: #ff5722;
  border-radius: 8rpx;
  padding: 4rpx 16rpx;
}

.badge-text {
  font-size: 24px;
  color: #fff;
}

.warning-box {
  background: #fff3e0;
  border: 2rpx solid #ff9800;
  border-radius: 12rpx;
  padding: 24rpx;
}

.warning-text {
  font-size: 24px;
  color: #e65100;
  font-weight: bold;
}

.section {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
}

.section-title {
  display: block;
  font-size: 43px;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 16rpx;
}

.section-body {
  display: block;
  font-size: 24px;
  color: #333;
  line-height: 1.8;
}

.actions {
  display: flex;
  gap: 24rpx;
  margin-top: 16rpx;
}

.action-btn {
  flex: 1;
  height: 117px;
  min-height: 117px;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-size: 24px;
}

.secondary-btn {
  background: #e0e0e0;
  color: #333;
}

.primary-btn {
  background: #4CAF50;
  color: #fff;
}

.primary-btn.playing {
  background: #f44336;
}

.btn-text {
  font-size: 24px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 32rpx;
}

.empty-text {
  font-size: 24px;
  color: #999;
}
</style>
