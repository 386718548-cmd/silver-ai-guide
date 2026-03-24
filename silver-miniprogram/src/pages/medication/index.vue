<template>
  <view class="page">
    <view class="header">
      <text class="title">AI 问药</text>
      <text class="subtitle">拍照识别药品说明书，AI 为您解读</text>
    </view>

    <!-- 语音引导提示 -->
    <view class="voice-hint">
      <text class="hint-label">💬 你可以这样说</text>
      <text class="hint-text">"帮我识别这个药"</text>
      <text class="hint-text">"这个药怎么吃"</text>
    </view>

    <!-- 拍照识别按钮 -->
    <view class="capture-section">
      <button
        class="capture-btn"
        :disabled="isProcessing"
        :class="{ disabled: isProcessing }"
        @tap="onCapture"
      >
        <text class="btn-icon">📷</text>
        <text class="btn-text">{{ isProcessing ? '识别中...' : '拍照识别' }}</text>
      </button>
    </view>

    <!-- 错误提示 -->
    <ErrorToast :message="medicationStore.errorMessage" @close="medicationStore.retry()" />

    <!-- 加载遮罩 -->
    <LoadingOverlay :visible="isProcessing" :message="loadingMessage" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMedicationStore } from '../../stores/medication'
import ErrorToast from '../../components/ErrorToast.vue'
import LoadingOverlay from '../../components/LoadingOverlay.vue'

const medicationStore = useMedicationStore()

const isProcessing = computed(() =>
  ['capturing', 'ocr', 'llm'].includes(medicationStore.status)
)

const loadingMessage = computed(() => {
  switch (medicationStore.status) {
    case 'capturing': return '正在打开相机...'
    case 'ocr': return '正在识别文字...'
    case 'llm': return 'AI 正在解析药品信息...'
    default: return '加载中...'
  }
})

function onCapture(): void {
  if (isProcessing.value) return
  medicationStore.startCapture()
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 40rpx 32rpx;
}

.header {
  margin-bottom: 48rpx;
}

.title {
  display: block;
  font-size: 43px;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 12rpx;
}

.subtitle {
  display: block;
  font-size: 24px;
  color: #666;
}

.voice-hint {
  background: #e8f5e9;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 48rpx;
}

.hint-label {
  display: block;
  font-size: 24px;
  color: #2e7d32;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.hint-text {
  display: block;
  font-size: 24px;
  color: #388e3c;
  margin-bottom: 8rpx;
}

.capture-section {
  display: flex;
  justify-content: center;
  margin-top: 80rpx;
}

.capture-btn {
  width: 117px;
  height: 117px;
  min-width: 117px;
  min-height: 117px;
  border-radius: 50%;
  background: #4CAF50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  padding: 0;
}

.capture-btn.disabled {
  background: #bdbdbd;
  box-shadow: none;
}

.btn-icon {
  font-size: 48rpx;
  display: block;
}

.btn-text {
  font-size: 24px;
  color: #fff;
  margin-top: 8rpx;
}
</style>
