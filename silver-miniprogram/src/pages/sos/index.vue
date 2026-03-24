<template>
  <view class="page">
    <!-- 倒计时阶段 -->
    <view v-if="sosStore.status === 'countdown'" class="countdown-screen">
      <text class="countdown-label">紧急求救将在</text>
      <text class="countdown-number">{{ sosStore.countdown }}</text>
      <text class="countdown-label">秒后发送</text>
      <view class="cancel-btn" @tap="cancel">
        <text class="cancel-text">取 消</text>
      </view>
    </view>

    <!-- 处理中 -->
    <view v-else-if="['triggering','locating','notifying'].includes(sosStore.status)" class="processing-screen">
      <text class="processing-icon">📡</text>
      <text class="processing-text">正在发送求救信号...</text>
      <text class="processing-sub">请稍候，正在通知您的家人</text>
    </view>

    <!-- 完成 -->
    <view v-else-if="['done','partial'].includes(sosStore.status)" class="result-screen">
      <text class="result-icon">{{ sosStore.status === 'done' ? '✅' : '⚠️' }}</text>
      <text class="result-title">{{ sosStore.status === 'done' ? '求救信号已发送' : '部分通知失败' }}</text>

      <view v-if="sosStore.lastRecord" class="notify-list">
        <view
          v-for="r in sosStore.lastRecord.notifyResults"
          :key="r.contactId"
          class="notify-item"
          :class="r.success ? 'success' : 'fail'"
        >
          <text class="notify-name">{{ r.contactName }}</text>
          <text class="notify-status">{{ r.success ? '✓ 已通知' : '✗ 失败' }}</text>
        </view>

        <!-- 全部失败时显示电话 -->
        <view v-if="allFailed" class="all-fail-tip">
          <text class="all-fail-text">通知发送失败，请拨打 120 或直接联系家人</text>
          <view v-for="r in sosStore.lastRecord.notifyResults" :key="r.contactId" class="phone-item">
            <text class="phone-text">{{ r.contactName }}：{{ getPhone(r.contactId) }}</text>
          </view>
        </view>
      </view>

      <view class="done-btn" @tap="goBack">
        <text class="done-text">返 回</text>
      </view>
    </view>

    <!-- 初始/空联系人 -->
    <view v-else class="idle-screen">
      <text class="idle-icon">🆘</text>
      <text class="idle-title">紧急救助</text>
      <text class="idle-sub">点击下方按钮发起紧急求救</text>
      <view class="sos-trigger-btn" @tap="startSos">
        <text class="sos-trigger-text">发起求救</text>
      </view>
      <view class="history-link" @tap="goHistory">
        <text class="history-link-text">查看求救记录 →</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useSosStore } from '../../stores/sosStore'
import { useContactStore } from '../../stores/contactStore'

const sosStore = useSosStore()
const contactStore = useContactStore()

onMounted(() => {
  contactStore.load()
  sosStore.loadRecords()
  // 如果从首页 SOS 按钮直接进入，自动开始倒计时
  const pages = getCurrentPages()
  const options = pages[pages.length - 1]?.options as any
  if (options?.autoStart === '1') {
    startSos()
  }
})

onUnmounted(() => {
  if (sosStore.status === 'countdown') {
    sosStore.cancel()
  }
})

const allFailed = computed(() => {
  const results = sosStore.lastRecord?.notifyResults ?? []
  return results.length > 0 && results.every(r => !r.success)
})

function getPhone(contactId: string): string {
  return contactStore.contacts.find(c => c.id === contactId)?.phone ?? '未知'
}

function startSos() {
  if (contactStore.contacts.length === 0) {
    uni.showModal({
      title: '尚未设置紧急联系人',
      content: '请先前往设置页面添加紧急联系人',
      confirmText: '去设置',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/settings/contacts' })
        }
      },
    })
    return
  }
  sosStore.startCountdown()
}

function cancel() {
  sosStore.cancel()
}

function goBack() {
  sosStore.reset()
  uni.navigateBack()
}

function goHistory() {
  uni.navigateTo({ url: '/pages/sos/history' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #c0392b;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 倒计时 */
.countdown-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  padding: 60rpx 40rpx;
}

.countdown-label {
  font-size: 40rpx;
  color: #fff;
  letter-spacing: 4rpx;
}

.countdown-number {
  font-size: 200rpx;
  font-weight: bold;
  color: #fff;
  line-height: 1;
  text-shadow: 0 4rpx 20rpx rgba(0,0,0,0.3);
}

.cancel-btn {
  margin-top: 60rpx;
  min-width: 300rpx;
  min-height: 88rpx;
  background: rgba(255,255,255,0.2);
  border: 4rpx solid #fff;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-text {
  font-size: 40rpx;
  color: #fff;
  letter-spacing: 8rpx;
}

/* 处理中 */
.processing-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32rpx;
}

.processing-icon {
  font-size: 120rpx;
}

.processing-text {
  font-size: 44rpx;
  color: #fff;
  font-weight: bold;
}

.processing-sub {
  font-size: 32rpx;
  color: rgba(255,255,255,0.8);
}

/* 结果 */
.result-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28rpx;
  padding: 60rpx 40rpx;
  width: 100%;
  box-sizing: border-box;
}

.result-icon {
  font-size: 100rpx;
}

.result-title {
  font-size: 44rpx;
  color: #fff;
  font-weight: bold;
}

.notify-list {
  width: 100%;
  background: rgba(255,255,255,0.15);
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.notify-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 20rpx;
  border-radius: 12rpx;
}

.notify-item.success {
  background: rgba(255,255,255,0.2);
}

.notify-item.fail {
  background: rgba(0,0,0,0.2);
}

.notify-name {
  font-size: 32rpx;
  color: #fff;
}

.notify-status {
  font-size: 28rpx;
  color: #fff;
}

.all-fail-tip {
  margin-top: 16rpx;
  padding: 20rpx;
  background: rgba(0,0,0,0.2);
  border-radius: 12rpx;
}

.all-fail-text {
  font-size: 28rpx;
  color: #fff;
  display: block;
  margin-bottom: 16rpx;
}

.phone-item {
  margin-top: 8rpx;
}

.phone-text {
  font-size: 30rpx;
  color: #fff;
}

.done-btn {
  min-width: 300rpx;
  min-height: 88rpx;
  background: rgba(255,255,255,0.2);
  border: 4rpx solid #fff;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
}

.done-text {
  font-size: 40rpx;
  color: #fff;
  letter-spacing: 8rpx;
}

/* 初始状态 */
.idle-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32rpx;
  padding: 60rpx 40rpx;
}

.idle-icon {
  font-size: 120rpx;
}

.idle-title {
  font-size: 60rpx;
  color: #fff;
  font-weight: bold;
  letter-spacing: 4rpx;
}

.idle-sub {
  font-size: 32rpx;
  color: rgba(255,255,255,0.8);
}

.sos-trigger-btn {
  min-width: 320rpx;
  min-height: 120rpx;
  background: #fff;
  border-radius: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.3);
}

.sos-trigger-text {
  font-size: 48rpx;
  color: #c0392b;
  font-weight: bold;
  letter-spacing: 4rpx;
}

.history-link {
  margin-top: 20rpx;
}

.history-link-text {
  font-size: 28rpx;
  color: rgba(255,255,255,0.7);
}
</style>
