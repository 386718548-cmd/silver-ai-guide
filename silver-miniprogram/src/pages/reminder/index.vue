<template>
  <view class="page">
    <view class="header">
      <text class="title">健康提醒</text>
    </view>

    <!-- 语音引导提示 -->
    <view class="voice-hint">
      <text class="hint-label">💬 你可以这样说</text>
      <text class="hint-text">"帮我设置每天早上八点吃药提醒"</text>
      <text class="hint-text">"提醒我明天下午三点量血压"</text>
    </view>

    <!-- 提醒列表 -->
    <view v-if="reminderStore.reminders.length === 0" class="empty">
      <text class="empty-text">暂无提醒，点击下方按钮新建</text>
    </view>

    <view v-else class="reminder-list">
      <view
        v-for="reminder in reminderStore.reminders"
        :key="reminder.id"
        class="reminder-card"
        :class="isCompleted(reminder) ? 'completed-card' : 'pending-card'"
        @tap="onCardTap(reminder.id)"
      >
        <view class="card-left">
          <text class="reminder-name">{{ reminder.name }}</text>
          <text class="reminder-time">⏰ {{ reminder.time }}</text>
          <text class="reminder-repeat">{{ repeatLabel(reminder.repeatType) }}</text>
          <view v-if="isCompleted(reminder)" class="completed-badge">
            <text class="badge-text">已完成</text>
          </view>
        </view>
        <view class="card-right">
          <switch
            class="toggle-switch"
            :checked="reminder.enabled"
            color="#4CAF50"
            @change="onToggle(reminder.id)"
          />
        </view>
      </view>
    </view>

    <!-- 新建提醒按钮 -->
    <view class="fab-area">
      <button class="fab-btn" @tap="onCreateReminder">
        <text class="fab-icon">＋</text>
        <text class="fab-text">新建提醒</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useReminderStore } from '../../stores/reminder'
import type { Reminder } from '../../types/index'

const reminderStore = useReminderStore()

function isCompleted(reminder: Reminder): boolean {
  if (reminder.completions.length === 0) return false
  const latest = reminder.completions[reminder.completions.length - 1]
  return latest.status === 'completed'
}

function repeatLabel(type: string): string {
  const map: Record<string, string> = {
    once: '单次',
    daily: '每天',
    weekly: '每周',
    custom: '自定义',
  }
  return map[type] || type
}

function onToggle(id: string): void {
  reminderStore.toggleReminder(id)
}

function onCardTap(id: string): void {
  uni.navigateTo({ url: `/pages/reminder/detail?id=${id}` })
}

function onCreateReminder(): void {
  uni.navigateTo({ url: '/pages/reminder/create' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 32rpx 32rpx 200rpx;
}

.header {
  margin-bottom: 32rpx;
}

.title {
  display: block;
  font-size: 43px;
  font-weight: bold;
  color: #1a1a1a;
}

.voice-hint {
  background: #e8f5e9;
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  margin-bottom: 32rpx;
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

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.empty-text {
  font-size: 24px;
  color: #999;
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.reminder-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 8rpx solid transparent;
}

.pending-card {
  border-left-color: #4CAF50;
}

.completed-card {
  border-left-color: #9e9e9e;
  opacity: 0.8;
}

.card-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.reminder-name {
  font-size: 24px;
  font-weight: bold;
  color: #1a1a1a;
}

.reminder-time {
  font-size: 24px;
  color: #4CAF50;
}

.reminder-repeat {
  font-size: 24px;
  color: #999;
}

.completed-badge {
  background: #e0e0e0;
  border-radius: 8rpx;
  padding: 4rpx 16rpx;
  align-self: flex-start;
  margin-top: 8rpx;
}

.badge-text {
  font-size: 24px;
  color: #757575;
}

.card-right {
  min-width: 117px;
  min-height: 117px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-switch {
  transform: scale(1.5);
}

.fab-area {
  position: fixed;
  bottom: 40rpx;
  left: 32rpx;
  right: 32rpx;
}

.fab-btn {
  width: 100%;
  height: 117px;
  min-height: 117px;
  background: #4CAF50;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  border: none;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.4);
}

.fab-icon {
  font-size: 43px;
  color: #fff;
}

.fab-text {
  font-size: 24px;
  color: #fff;
  font-weight: bold;
}
</style>
