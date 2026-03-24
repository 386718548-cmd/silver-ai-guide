<template>
  <view v-if="visible" class="loading-overlay">
    <view class="loading-box">
      <view class="spinner" />
      <text class="loading-text">{{ message }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: '加载中...',
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
}

.loading-box {
  background: #fff;
  border-radius: 16rpx;
  padding: 48rpx 64rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid #e0e0e0;
  border-top-color: #4CAF50;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #333;
}
</style>
