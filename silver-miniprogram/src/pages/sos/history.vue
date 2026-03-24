<template>
  <view class="page">
    <view v-if="sosStore.displayRecords.length === 0" class="empty">
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无求救记录</text>
    </view>

    <view v-for="record in sosStore.displayRecords" :key="record.id" class="record-card">
      <view class="record-header">
        <text class="record-time">{{ formatTime(record.triggeredAt) }}</text>
        <view class="status-badge" :class="record.status">
          <text class="status-text">{{ statusLabel(record.status) }}</text>
        </view>
      </view>

      <view class="record-location">
        <text class="location-icon">📍</text>
        <text class="location-text">{{ record.location.address }}</text>
      </view>

      <view class="notify-results">
        <view
          v-for="r in record.notifyResults"
          :key="r.contactId"
          class="notify-row"
        >
          <text class="notify-name">{{ r.contactName }}</text>
          <text class="notify-status" :class="r.success ? 'ok' : 'fail'">
            {{ r.success ? '✓ 已通知' : '✗ 失败' }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSosStore } from '../../stores/sosStore'
import type { SosRecord } from '../../types/index'

const sosStore = useSosStore()

onMounted(() => {
  sosStore.loadRecords()
  sosStore.cleanOldRecords()
})

function formatTime(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function statusLabel(status: SosRecord['status']): string {
  return { success: '全部成功', partial: '部分成功', failed: '全部失败' }[status]
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f3eb;
  padding: 32rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
  gap: 24rpx;
}

.empty-icon {
  font-size: 100rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #b8a88a;
}

.record-card {
  background: #fff9f0;
  border: 2rpx solid #d4c4a8;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.record-time {
  font-size: 30rpx;
  color: #5a4a3a;
}

.status-badge {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

.status-badge.success {
  background: #e8f5e9;
}

.status-badge.partial {
  background: #fff8e1;
}

.status-badge.failed {
  background: #ffebee;
}

.status-text {
  font-size: 26rpx;
}

.status-badge.success .status-text { color: #2e7d32; }
.status-badge.partial .status-text { color: #f57f17; }
.status-badge.failed .status-text { color: #c62828; }

.record-location {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.location-icon {
  font-size: 28rpx;
  flex-shrink: 0;
}

.location-text {
  font-size: 28rpx;
  color: #7a6a55;
  flex: 1;
  line-height: 1.5;
}

.notify-results {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  border-top: 2rpx solid #e8dcc8;
  padding-top: 16rpx;
}

.notify-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notify-name {
  font-size: 30rpx;
  color: #1a1a1a;
}

.notify-status {
  font-size: 28rpx;
}

.notify-status.ok { color: #2e7d32; }
.notify-status.fail { color: #c62828; }
</style>
