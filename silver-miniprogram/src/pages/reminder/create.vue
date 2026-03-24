<template>
  <view class="page">
    <view class="header">
      <text class="title">新建提醒</text>
    </view>

    <!-- 提醒名称 -->
    <view class="form-group">
      <text class="label">提醒名称</text>
      <view class="input-row">
        <input
          v-model="form.name"
          class="input"
          placeholder="请输入提醒名称"
          maxlength="30"
        />
        <button class="voice-input-btn" @tap="onVoiceInput">
          <text class="voice-icon">🎤</text>
        </button>
      </view>
    </view>

    <!-- 提醒时间 -->
    <view class="form-group">
      <text class="label">提醒时间</text>
      <picker mode="time" :value="form.time" @change="onTimeChange">
        <view class="picker-view" :class="{ error: timeError }">
          <text class="picker-text">{{ form.time || '请选择时间' }}</text>
          <text class="picker-arrow">›</text>
        </view>
      </picker>
      <text v-if="timeError" class="error-msg">{{ timeError }}</text>
    </view>

    <!-- 重复周期 -->
    <view class="form-group">
      <text class="label">重复周期</text>
      <view class="repeat-options">
        <view
          v-for="opt in repeatOptions"
          :key="opt.value"
          class="repeat-option"
          :class="{ selected: form.repeatType === opt.value }"
          @tap="form.repeatType = opt.value"
        >
          <text class="option-text">{{ opt.label }}</text>
        </view>
      </view>
    </view>

    <!-- 备注 -->
    <view class="form-group">
      <text class="label">备注（可选）</text>
      <textarea
        v-model="form.note"
        class="textarea"
        placeholder="添加备注..."
        maxlength="100"
      />
    </view>

    <!-- 提交按钮 -->
    <view class="submit-area">
      <button class="submit-btn" :disabled="submitting" @tap="onSubmit">
        <text class="submit-text">{{ submitting ? '保存中...' : '保存提醒' }}</text>
      </button>
    </view>

    <!-- 错误提示 -->
    <ErrorToast :message="errorMsg" @close="errorMsg = ''" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReminderStore } from '../../stores/reminder'
import type { CreateReminderDto } from '../../types/index'
import ErrorToast from '../../components/ErrorToast.vue'

const reminderStore = useReminderStore()

const form = ref({
  name: '',
  time: '',
  repeatType: 'once' as 'once' | 'daily' | 'weekly' | 'custom',
  note: '',
  enabled: true,
})

const timeError = ref('')
const errorMsg = ref('')
const submitting = ref(false)
const isFirstReminder = ref(reminderStore.reminders.length === 0)

const repeatOptions = [
  { value: 'once', label: '单次' },
  { value: 'daily', label: '每天' },
  { value: 'weekly', label: '每周' },
  { value: 'custom', label: '自定义' },
]

onMounted(() => {
  // 支持从语音助手跳转时预填
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = (currentPage as any)?.options || {}
  if (options.time) form.value.time = options.time
  if (options.name) form.value.name = decodeURIComponent(options.name)
})

function onTimeChange(e: any): void {
  form.value.time = e.detail.value
  timeError.value = ''
}

function onVoiceInput(): void {
  uni.showToast({ title: '语音输入功能开发中', icon: 'none' })
}

async function onSubmit(): Promise<void> {
  if (!form.value.name.trim()) {
    errorMsg.value = '请输入提醒名称'
    return
  }
  if (!form.value.time) {
    timeError.value = '请选择提醒时间'
    return
  }

  // 验证时间（单次提醒需大于当前时间）
  if (form.value.repeatType === 'once') {
    const [hours, minutes] = form.value.time.split(':').map(Number)
    const now = new Date()
    const reminderDate = new Date()
    reminderDate.setHours(hours, minutes, 0, 0)
    if (reminderDate <= now) {
      timeError.value = '提醒时间不能早于当前时间'
      return
    }
  }

  submitting.value = true

  try {
    // 首次创建时申请订阅权限
    if (isFirstReminder.value) {
      await requestSubscription()
    }

    const dto: CreateReminderDto = {
      name: form.value.name.trim(),
      time: form.value.time,
      repeatType: form.value.repeatType,
      note: form.value.note || undefined,
      enabled: true,
    }

    await reminderStore.createReminder(dto)
    uni.showToast({ title: '提醒已保存', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch (e: unknown) {
    const err = e as Error
    errorMsg.value = err.message || '保存失败，请重试'
  } finally {
    submitting.value = false
  }
}

async function requestSubscription(): Promise<void> {
  return new Promise(resolve => {
    uni.requestSubscribeMessage({
      tmplIds: ['health_reminder_template'],
      success: () => resolve(),
      fail: () => {
        uni.showToast({
          title: '未授权将无法收到微信通知，提醒仍会在小程序内显示',
          icon: 'none',
          duration: 3000,
        })
        resolve()
      },
    })
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 32rpx 32rpx 200rpx;
}

.header {
  margin-bottom: 40rpx;
}

.title {
  display: block;
  font-size: 43px;
  font-weight: bold;
  color: #1a1a1a;
}

.form-group {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.label {
  display: block;
  font-size: 24px;
  color: #666;
  margin-bottom: 16rpx;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.input {
  flex: 1;
  font-size: 24px;
  color: #1a1a1a;
  height: 80rpx;
  border-bottom: 2rpx solid #e0e0e0;
  padding: 0 8rpx;
}

.voice-input-btn {
  width: 80rpx;
  height: 80rpx;
  min-width: 80rpx;
  min-height: 80rpx;
  background: #e8f5e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
}

.voice-icon {
  font-size: 36rpx;
}

.picker-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  border-bottom: 2rpx solid #e0e0e0;
  padding: 0 8rpx;
}

.picker-view.error {
  border-bottom-color: #f44336;
}

.picker-text {
  font-size: 24px;
  color: #1a1a1a;
}

.picker-arrow {
  font-size: 32rpx;
  color: #999;
}

.error-msg {
  display: block;
  font-size: 24px;
  color: #f44336;
  margin-top: 8rpx;
}

.repeat-options {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.repeat-option {
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  border: 2rpx solid #e0e0e0;
  background: #f5f5f5;
  min-height: 80rpx;
  display: flex;
  align-items: center;
}

.repeat-option.selected {
  background: #4CAF50;
  border-color: #4CAF50;
}

.option-text {
  font-size: 24px;
  color: #333;
}

.repeat-option.selected .option-text {
  color: #fff;
}

.textarea {
  width: 100%;
  font-size: 24px;
  color: #1a1a1a;
  min-height: 120rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 16rpx;
  box-sizing: border-box;
}

.submit-area {
  position: fixed;
  bottom: 40rpx;
  left: 32rpx;
  right: 32rpx;
}

.submit-btn {
  width: 100%;
  height: 117px;
  min-height: 117px;
  background: #4CAF50;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.4);
}

.submit-btn[disabled] {
  background: #bdbdbd;
  box-shadow: none;
}

.submit-text {
  font-size: 24px;
  color: #fff;
  font-weight: bold;
}
</style>
