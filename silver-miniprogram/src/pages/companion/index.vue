<template>
  <view class="page">
    <!-- 消息列表 -->
    <scroll-view
      class="msg-list"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
    >
      <view v-for="msg in companionStore.messages" :key="msg.id" class="msg-row" :class="msg.role">
        <view v-if="msg.role === 'assistant'" class="avatar">🤖</view>
        <view class="bubble" :class="msg.role">
          <text class="bubble-text">{{ msg.content }}</text>
          <!-- 负面情绪入口 -->
          <view
            v-if="msg.role === 'assistant' && hasNegativeEmotion(msg.content)"
            class="sos-hint"
            @tap="goSos"
          >
            <text class="sos-hint-text">需要帮助？一键联系家人 →</text>
          </view>
        </view>
        <view v-if="msg.role === 'user'" class="avatar user-avatar">👤</view>
      </view>

      <!-- 思考中 -->
      <view v-if="companionStore.loading" class="msg-row assistant">
        <view class="avatar">🤖</view>
        <view class="bubble assistant thinking">
          <text class="bubble-text">AI 正在思考中...</text>
        </view>
      </view>
    </scroll-view>

    <!-- 话题快捷按钮 -->
    <view class="topics">
      <view
        v-for="topic in TOPICS"
        :key="topic"
        class="topic-btn"
        @tap="sendTopic(topic)"
      >
        <text class="topic-text">{{ topic }}</text>
      </view>
    </view>

    <!-- 底部输入区 -->
    <view class="input-bar">
      <input
        v-model="inputText"
        class="input"
        placeholder="说说您的心里话..."
        :placeholder-style="'color:#b8a88a;font-size:30rpx'"
        confirm-type="send"
        @confirm="sendText"
      />
      <view class="send-btn" @tap="sendText">
        <text class="send-icon">发送</text>
      </view>
      <view class="voice-btn" @tap="startVoice">
        <text class="voice-icon">🎤</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useCompanionStore } from '../../stores/companionStore'
import { companionLlmService } from '../../services/companionLlm'
import { dialectAsrService } from '../../services/dialectAsr'
import { getStorage, STORAGE_KEYS } from '../../utils/storage'
import type { DialectMode } from '../../types/index'

const companionStore = useCompanionStore()
const inputText = ref('')
const scrollTop = ref(0)
let scrollCounter = 0

const TOPICS = ['聊聊今天', '讲个故事', '健康小知识', '想念家人']

onMounted(async () => {
  companionStore.loadHistory()
  await companionStore.initGreeting()
  scrollToBottom()
})

function scrollToBottom() {
  nextTick(() => {
    // 每次递增确保 scroll-view 检测到变化
    scrollCounter += 10000
    scrollTop.value = scrollCounter
  })
}

async function sendText() {
  const text = inputText.value.trim()
  if (!text) return
  inputText.value = ''
  await companionStore.sendMessage(text)
  scrollToBottom()
}

async function sendTopic(topic: string) {
  await companionStore.sendTopicPrompt(topic)
  scrollToBottom()
}

function hasNegativeEmotion(text: string): boolean {
  return companionLlmService.detectNegativeEmotion(text)
}

function goSos() {
  uni.navigateTo({ url: '/pages/sos/index' })
}

async function startVoice() {
  const mode = getStorage<DialectMode>(STORAGE_KEYS.SILVER_DIALECT_MODE) ?? 'mandarin'
  try {
    dialectAsrService.startRecording(mode)
    uni.showToast({ title: '正在录音...', icon: 'none', duration: 3000 })
    const result = await dialectAsrService.stopRecording()
    uni.hideToast()
    if (result.success && result.text.trim() && result.confidence >= 0.5) {
      await companionStore.sendMessage(result.text)
      scrollToBottom()
    } else {
      uni.showToast({ title: '没有听清，请再说一遍', icon: 'none' })
    }
  } catch {
    uni.showToast({ title: '语音识别失败，请重试', icon: 'none' })
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7f3eb;
}

.msg-list {
  flex: 1;
  padding: 24rpx 24rpx 0;
  overflow: hidden;
}

.msg-row {
  display: flex;
  align-items: flex-end;
  margin-bottom: 28rpx;
  gap: 16rpx;
}

.msg-row.user {
  flex-direction: row-reverse;
}

.avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #e8dcc8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  flex-shrink: 0;
}

.user-avatar {
  background: #c0392b22;
}

.bubble {
  max-width: 68%;
  padding: 24rpx 28rpx;
  border-radius: 20rpx;
  background: #fff9f0;
  border: 2rpx solid #d4c4a8;
  word-break: break-all;
  overflow-wrap: break-word;
  box-sizing: border-box;
}

.bubble.user {
  background: #c0392b;
  border-color: #c0392b;
}

.bubble-text {
  font-size: 32rpx;
  line-height: 1.6;
  color: #1a1a1a;
}

.bubble.user .bubble-text {
  color: #fff;
}

.bubble.thinking .bubble-text {
  color: #b8a88a;
}

.sos-hint {
  margin-top: 16rpx;
  padding: 12rpx 16rpx;
  background: #fff0f0;
  border-radius: 12rpx;
  border: 2rpx solid #c0392b44;
}

.sos-hint-text {
  font-size: 26rpx;
  color: #c0392b;
}

/* 话题按钮 */
.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  background: #f7f3eb;
  border-top: 2rpx solid #e8dcc8;
}

.topic-btn {
  padding: 14rpx 24rpx;
  background: #fff9f0;
  border: 2rpx solid #d4c4a8;
  border-radius: 40rpx;
}

.topic-text {
  font-size: 26rpx;
  color: #5a4a3a;
}

/* 输入区 */
.input-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 24rpx;
  background: #fff9f0;
  border-top: 2rpx solid #d4c4a8;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.input {
  flex: 1;
  height: 80rpx;
  background: #f7f3eb;
  border: 2rpx solid #d4c4a8;
  border-radius: 40rpx;
  padding: 0 28rpx;
  font-size: 30rpx;
  color: #1a1a1a;
}

.send-btn {
  min-width: 88rpx;
  height: 80rpx;
  background: #c0392b;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24rpx;
}

.send-icon {
  font-size: 28rpx;
  color: #fff;
}

.voice-btn {
  width: 88rpx;
  height: 88rpx;
  background: #5D4037;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.voice-icon {
  font-size: 40rpx;
}
</style>
