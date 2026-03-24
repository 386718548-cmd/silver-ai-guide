<template>
  <view v-if="visible" class="error-toast" @tap="onClose">
    <text class="error-icon">⚠️</text>
    <text class="error-text">{{ message }}</text>
    <text class="close-btn">✕</text>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  message: string
  duration?: number // ms, 0 = 不自动消失
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const visible = ref(false)
let autoCloseTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.message,
  (val) => {
    if (val) {
      visible.value = true
      if (autoCloseTimer) clearTimeout(autoCloseTimer)
      if (props.duration > 0) {
        autoCloseTimer = setTimeout(() => {
          visible.value = false
          emit('close')
        }, props.duration)
      }
    } else {
      visible.value = false
    }
  },
  { immediate: true }
)

function onClose(): void {
  if (autoCloseTimer) clearTimeout(autoCloseTimer)
  visible.value = false
  emit('close')
}
</script>

<style scoped>
.error-toast {
  position: fixed;
  top: 80rpx;
  left: 32rpx;
  right: 32rpx;
  background: #fff3cd;
  border: 2rpx solid #ffc107;
  border-radius: 12rpx;
  padding: 24rpx 32rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.error-icon {
  font-size: 32rpx;
  flex-shrink: 0;
}

.error-text {
  flex: 1;
  font-size: 28rpx;
  color: #856404;
  line-height: 1.5;
}

.close-btn {
  font-size: 28rpx;
  color: #856404;
  flex-shrink: 0;
  padding: 8rpx;
}
</style>
