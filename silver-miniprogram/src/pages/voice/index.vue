<template>
  <view class="page">
    <!-- 方言模式选择器 -->
    <view class="dialect-selector">
      <view
        v-for="item in dialectOptions"
        :key="item.value"
        class="dialect-option"
        :class="{ active: currentDialect === item.value }"
        @tap="selectDialect(item.value)"
      >
        <text class="dialect-label">{{ item.label }}</text>
      </view>
    </view>

    <!-- 语音引导提示 -->
    <view class="voice-hint">
      <text class="hint-label">💬 你可以这样说</text>
      <text class="hint-text">"这个药怎么吃"</text>
      <text class="hint-text">"帮我设置明天早上吃药提醒"</text>
      <text class="hint-text">"布洛芬有什么副作用"</text>
    </view>

    <!-- 对话历史 -->
    <scroll-view class="chat-list" scroll-y :scroll-top="scrollTop">
      <view v-if="voiceStore.messages.length === 0" class="empty-chat">
        <text class="empty-text">长按右下角麦克风开始对话</text>
      </view>
      <view
        v-for="msg in voiceStore.messages"
        :key="msg.id"
        class="message-row"
        :class="msg.role === 'user' ? 'user-row' : 'ai-row'"
      >
        <view class="bubble" :class="msg.role === 'user' ? 'user-bubble' : 'ai-bubble'">
          <text class="bubble-text">{{ msg.content }}</text>
        </view>
      </view>

      <!-- 处理中状态 -->
      <view v-if="voiceStore.isProcessing" class="message-row ai-row">
        <view class="bubble ai-bubble processing-bubble">
          <text class="bubble-text">AI 思考中...</text>
        </view>
      </view>
    </scroll-view>

    <!-- 状态栏 -->
    <view class="status-bar">
      <view v-if="voiceStore.isRecording" class="recording-status">
        <view class="recording-dot" />
        <text class="status-text">正在录音，松开发送</text>
      </view>
      <view v-else-if="voiceStore.isProcessing" class="processing-status">
        <text class="status-text">正在处理...</text>
      </view>
      <view v-else-if="voiceStore.errorMessage" class="error-status">
        <text class="status-text error-text">{{ voiceStore.errorMessage }}</text>
      </view>
      <view v-else class="idle-status">
        <text class="status-text">长按右下角麦克风说话</text>
      </view>
    </view>

    <!-- 悬浮麦克风 -->
    <FloatingMic />
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useVoiceStore } from '../../stores/voice'
import FloatingMic from '../../components/FloatingMic.vue'
import { STORAGE_KEYS } from '../../utils/storage'
import type { DialectMode } from '../../types/index'

const voiceStore = useVoiceStore()
const scrollTop = ref(0)

const dialectOptions: { label: string; value: DialectMode }[] = [
  { label: '普通话', value: 'mandarin' },
  { label: '粤语', value: 'cantonese' },
  { label: '闽南语', value: 'hokkien' },
  { label: '四川话', value: 'sichuan' },
]

const currentDialect = ref<DialectMode>('mandarin')

function selectDialect(mode: DialectMode): void {
  currentDialect.value = mode
  uni.setStorageSync(STORAGE_KEYS.SILVER_DIALECT_MODE, mode)
}

onShow(() => {
  const saved = uni.getStorageSync(STORAGE_KEYS.SILVER_DIALECT_MODE) as DialectMode | ''
  if (saved && saved !== '') {
    currentDialect.value = saved
  }
})

// 新消息时滚动到底部
watch(
  () => voiceStore.messages.length,
  () => {
    setTimeout(() => {
      scrollTop.value = 99999
    }, 100)
  }
)
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  padding-bottom: 160rpx;
}

.dialect-selector {
  display: flex;
  flex-direction: row;
  background: #fff;
  padding: 16rpx 24rpx;
  border-bottom: 1rpx solid #e0e0e0;
  gap: 16rpx;
}

.dialect-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx 8rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e0e0e0;
  background: #f9f9f9;
}

.dialect-option.active {
  background: #4CAF50;
  border-color: #4CAF50;
}

.dialect-label {
  font-size: 32rpx;
  color: #555;
  font-weight: 500;
}

.dialect-option.active .dialect-label {
  color: #fff;
  font-weight: bold;
}

.voice-hint {
  background: #e8f5e9;
  padding: 24rpx 32rpx;
  margin: 24rpx 24rpx 0;
  border-radius: 16rpx;
}

.hint-label {
  display: block;
  font-size: 24px;
  color: #2e7d32;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.hint-text {
  display: block;
  font-size: 24px;
  color: #388e3c;
  margin-bottom: 4rpx;
}

.chat-list {
  flex: 1;
  padding: 24rpx;
  height: calc(100vh - 480rpx);
}

.empty-chat {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.empty-text {
  font-size: 24px;
  color: #999;
}

.message-row {
  display: flex;
  margin-bottom: 24rpx;
}

.user-row {
  justify-content: flex-end;
}

.ai-row {
  justify-content: flex-start;
}

.bubble {
  max-width: 70%;
  padding: 24rpx 32rpx;
  border-radius: 20rpx;
}

.user-bubble {
  background: #4CAF50;
  border-bottom-right-radius: 4rpx;
}

.ai-bubble {
  background: #fff;
  border-bottom-left-radius: 4rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.processing-bubble {
  background: #f5f5f5;
}

.bubble-text {
  font-size: 24px;
  line-height: 1.6;
  color: #333;
}

.user-bubble .bubble-text {
  color: #fff;
}

.status-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid #e0e0e0;
  min-height: 88rpx;
  display: flex;
  align-items: center;
}

.recording-status,
.processing-status,
.error-status,
.idle-status {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.recording-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #f44336;
  animation: blink 0.8s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.status-text {
  font-size: 24px;
  color: #666;
}

.error-text {
  color: #f44336;
}
</style>
