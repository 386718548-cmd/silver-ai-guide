<template>
  <view class="page">
    <view v-if="reminder" class="content">
      <!-- 提醒详情 -->
      <view class="detail-card">
        <text class="reminder-name">{{ reminder.name }}</text>
        <view class="detail-row">
          <text class="detail-label">提醒时间</text>
          <text class="detail-value">{{ reminder.time }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">重复周期</text>
          <text class="detail-value">{{ repeatLabel(reminder.repeatType) }}</text>
        </view>
        <view v-if="reminder.note" class="detail-row">
          <text class="detail-label">备注</text>
          <text class="detail-value">{{ reminder.note }}</text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="actions">
        <button class="action-btn complete-btn" @tap="onComplete">
          <text class="btn-text">✅ 已完成</text>
        </button>
        <button class="action-btn snooze-btn" @tap="onSnooze">
          <text class="btn-text">⏰ 稍后提醒（15分钟后）</text>
        </button>
      </view>

      <!-- 最近完成记录 -->
      <view v-if="reminder.completions.length > 0" class="completions-section">
        <text class="section-title">最近完成记录</text>
        <view
          v-for="(c, idx) in recentCompletions"
          :key="idx"
          class="completion-item"
        >
          <text class="completion-status">{{ completionStatusLabel(c.status) }}</text>
          <text class="completion-time">{{ formatTime(c.completedAt) }}</text>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-text">提醒不存在</text>
      <button class="action-btn snooze-btn" @tap="() => uni.navigateBack()">返回</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useReminderStore } from '../../stores/reminder'
import type { ReminderCompletion } from '../../types/index'

const reminderStore = useReminderStore()
const reminderId = ref('')

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = (currentPage as any)?.options || {}
  reminderId.value = options.id || ''
})

const reminder = computed(() =>
  reminderStore.reminders.find(r => r.id === reminderId.value) || null
)

const recentCompletions = computed(() => {
  if (!reminder.value) return []
  return [...reminder.value.completions].reverse().slice(0, 5)
})

function repeatLabel(type: string): string {
  const map: Record<string, string> = {
    once: '单次',
    daily: '每天',
    weekly: '每周',
    custom: '自定义',
  }
  return map[type] || type
}

function completionStatusLabel(status: ReminderCompletion['status']): string {
  const map = {
    completed: '✅ 已完成',
    snoozed: '⏰ 已推迟',
    missed: '❌ 已错过',
  }
  return map[status]
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function onComplete(): void {
  if (!reminderId.value) return
  reminderStore.completeReminder(reminderId.value)
  uni.showToast({ title: '已标记完成', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1000)
}

function onSnooze(): void {
  if (!reminderId.value) return
  reminderStore.snoozeReminder(reminderId.value)
  uni.showToast({ title: '已设置15分钟后提醒', icon: 'none' })
  setTimeout(() => uni.navigateBack(), 1000)
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

.detail-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.reminder-name {
  display: block;
  font-size: 43px;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 32rpx;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  margin-bottom: 16rpx;
}

.detail-label {
  font-size: 24px;
  color: #999;
  min-width: 120rpx;
}

.detail-value {
  font-size: 24px;
  color: #333;
  flex: 1;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.action-btn {
  width: 100%;
  height: 117px;
  min-height: 117px;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.complete-btn {
  background: #4CAF50;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.4);
}

.snooze-btn {
  background: #FF9800;
  box-shadow: 0 4px 16px rgba(255, 152, 0, 0.4);
}

.btn-text {
  font-size: 24px;
  color: #fff;
  font-weight: bold;
}

.completions-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
}

.section-title {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
}

.completion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.completion-status {
  font-size: 24px;
  color: #333;
}

.completion-time {
  font-size: 24px;
  color: #999;
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
