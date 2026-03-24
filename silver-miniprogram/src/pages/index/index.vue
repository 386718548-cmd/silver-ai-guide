<template>
  <view class="page">

    <!-- 顶部水墨 Header -->
    <view class="header">
      <view class="ink-brush-line" />
      <view class="header-inner">
        <view class="header-left">
          <text class="seal-tag">银龄</text>
          <text class="title-cn">AI 助手</text>
          <text class="title-sub">您的贴心健康伙伴</text>
        </view>
        <view class="header-right">
          <text class="deco-char">寿</text>
        </view>
      </view>
      <view class="ink-brush-line thin" />
    </view>

    <!-- 快捷设置栏 -->
    <view class="quick-bar">
      <view class="quick-btn" @tap="navigate('/pages/settings/theme')">
        <text class="quick-icon">🎨</text>
        <text class="quick-label">换主题</text>
      </view>
      <view class="quick-btn" @tap="navigate('/pages/settings/contacts')">
        <text class="quick-icon">👥</text>
        <text class="quick-label">紧急联系人</text>
      </view>
      <view class="quick-btn" @tap="navigate('/pages/sos/history')">
        <text class="quick-icon">📋</text>
        <text class="quick-label">求救记录</text>
      </view>
    </view>

    <!-- 功能卡片 -->
    <view class="section-label">
      <text class="section-dot">◆</text>
      <text class="section-text">常用功能</text>
      <text class="section-dot">◆</text>
    </view>

    <view class="cards">

      <view class="ink-card" @tap="navigate('/pages/medication/index')">
        <view class="ink-card-left">
          <text class="ink-icon">💊</text>
        </view>
        <view class="ink-card-body">
          <text class="ink-card-title">AI 问药</text>
          <text class="ink-card-desc">拍药盒识说明，解读用法用量</text>
        </view>
        <view class="ink-card-right">
          <text class="ink-arrow">→</text>
        </view>
      </view>

      <view class="divider-dots"><text>· · · · · · · · · · · · · · ·</text></view>

      <view class="ink-card" @tap="navigate('/pages/voice/index')">
        <view class="ink-card-left">
          <text class="ink-icon">🎤</text>
        </view>
        <view class="ink-card-body">
          <text class="ink-card-title">语音助手</text>
          <text class="ink-card-desc">长按说话，随问随答</text>
        </view>
        <view class="ink-card-right">
          <text class="ink-arrow">→</text>
        </view>
      </view>

      <view class="divider-dots"><text>· · · · · · · · · · · · · · ·</text></view>

      <view class="ink-card" @tap="navigate('/pages/reminder/index')">
        <view class="ink-card-left">
          <text class="ink-icon">⏰</text>
        </view>
        <view class="ink-card-body">
          <text class="ink-card-title">健康提醒</text>
          <text class="ink-card-desc">按时吃药，健康每一天</text>
        </view>
        <view class="ink-card-right">
          <text class="ink-arrow">→</text>
        </view>
      </view>

      <view class="divider-dots"><text>· · · · · · · · · · · · · · ·</text></view>

      <view class="ink-card" @tap="navigate('/pages/companion/index')">
        <view class="ink-card-left">
          <text class="ink-icon">💬</text>
        </view>
        <view class="ink-card-body">
          <text class="ink-card-title">AI 陪伴</text>
          <text class="ink-card-desc">聊聊天，说说心里话</text>
        </view>
        <view class="ink-card-right">
          <text class="ink-arrow">→</text>
        </view>
      </view>

      <view class="divider-dots"><text>· · · · · · · · · · · · · · ·</text></view>

      <view class="ink-card sos-card" @tap="navigate('/pages/sos/index')">
        <view class="ink-card-left sos-icon-wrap">
          <text class="ink-icon">🆘</text>
        </view>
        <view class="ink-card-body">
          <text class="ink-card-title sos-title">紧急救助</text>
          <text class="ink-card-desc">一键求救，守护安全</text>
        </view>
        <view class="ink-card-right">
          <text class="ink-arrow sos-arrow">→</text>
        </view>
      </view>

    </view>

    <!-- 语音提示 -->
    <view class="hint-wrap">
      <view class="hint-title-row">
        <text class="hint-line-deco">——</text>
        <text class="hint-title">您可以这样说</text>
        <text class="hint-line-deco">——</text>
      </view>
      <view class="hint-items">
        <text class="hint-item">「 帮我查一下这个药怎么吃 」</text>
        <text class="hint-item">「 提醒我每天早上八点吃药 」</text>
        <text class="hint-item">「 这个药能和柚子一起吃吗 」</text>
      </view>
    </view>

    <!-- 底部装饰 -->
    <view class="footer-deco">
      <text class="footer-text">健康 · 安心 · 相伴</text>
    </view>

    <!-- 右上角 SOS 快捷按钮 -->
    <view class="sos-fab" @tap="navigate('/pages/sos/index')">
      <text class="sos-fab-text">SOS</text>
    </view>

    <FloatingMic />
  </view>
</template>

<script setup lang="ts">
import FloatingMic from '../../components/FloatingMic.vue'
function navigate(url: string) {
  uni.navigateTo({ url })
}
</script>

<style scoped>
/* 整体背景：宣纸米白 */
.page {
  min-height: 100vh;
  background: #f7f3eb;
  padding-bottom: 160rpx;
}

/* Header */
.header {
  padding: 60rpx 48rpx 32rpx;
  background: #f7f3eb;
}

.ink-brush-line {
  height: 4rpx;
  background: linear-gradient(to right, transparent, #2c2c2c 30%, #2c2c2c 70%, transparent);
  margin-bottom: 32rpx;
  border-radius: 2rpx;
}

.ink-brush-line.thin {
  height: 2rpx;
  margin-top: 32rpx;
  margin-bottom: 0;
  background: linear-gradient(to right, transparent, #8b7355 30%, #8b7355 70%, transparent);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.seal-tag {
  display: inline-block;
  font-size: 22rpx;
  color: #fff;
  background: #c0392b;
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
  letter-spacing: 4rpx;
  margin-bottom: 12rpx;
  width: fit-content;
}

.title-cn {
  font-size: 64rpx;
  font-weight: bold;
  color: #1a1a1a;
  letter-spacing: 4rpx;
  line-height: 1.2;
  font-family: serif;
}

.title-sub {
  font-size: 26rpx;
  color: #7a6a55;
  margin-top: 8rpx;
  letter-spacing: 2rpx;
}

.header-right {
  width: 120rpx;
  height: 120rpx;
  border: 3rpx solid #c0392b;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(5deg);
}

.deco-char {
  font-size: 72rpx;
  color: #c0392b;
  font-family: serif;
  font-weight: bold;
}

/* 快捷设置栏 */
.quick-bar {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 40rpx;
  background: #fff9f0;
  border-bottom: 2rpx solid #e8dcc8;
}

.quick-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
}

.quick-icon {
  font-size: 40rpx;
}

.quick-label {
  font-size: 22rpx;
  color: #7a6a55;
  letter-spacing: 1rpx;
}

/* Section label */
.section-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 40rpx 0 24rpx;
}

.section-dot {
  font-size: 20rpx;
  color: #c0392b;
}

.section-text {
  font-size: 28rpx;
  color: #5a4a3a;
  letter-spacing: 6rpx;
}

/* Cards */
.cards {
  margin: 0 40rpx;
  background: #fff9f0;
  border-radius: 16rpx;
  border: 2rpx solid #d4c4a8;
  padding: 8rpx 0;
  box-shadow: 4px 4px 0 #d4c4a8;
}

.ink-card {
  display: flex;
  align-items: center;
  padding: 36rpx 40rpx;
  gap: 28rpx;
}

.ink-card-left {
  width: 80rpx;
  height: 80rpx;
  background: #f0e8d8;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ink-icon {
  font-size: 44rpx;
}

.ink-card-body {
  flex: 1;
}

.ink-card-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #1a1a1a;
  font-family: serif;
  letter-spacing: 2rpx;
  margin-bottom: 8rpx;
}

.ink-card-desc {
  display: block;
  font-size: 24rpx;
  color: #7a6a55;
  letter-spacing: 1rpx;
}

.ink-card-right {
  flex-shrink: 0;
}

.ink-arrow {
  font-size: 36rpx;
  color: #c0392b;
}

.divider-dots {
  text-align: center;
  font-size: 20rpx;
  color: #d4c4a8;
  letter-spacing: 2rpx;
}

/* Hint */
.hint-wrap {
  margin: 40rpx 40rpx 0;
  padding: 36rpx;
  background: #fff9f0;
  border-radius: 16rpx;
  border: 2rpx solid #d4c4a8;
  box-shadow: 4px 4px 0 #d4c4a8;
}

.hint-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 28rpx;
}

.hint-line-deco {
  font-size: 24rpx;
  color: #b8a88a;
}

.hint-title {
  font-size: 28rpx;
  color: #5a4a3a;
  letter-spacing: 4rpx;
  font-family: serif;
}

.hint-items {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.hint-item {
  font-size: 26rpx;
  color: #7a6a55;
  text-align: center;
  letter-spacing: 1rpx;
  line-height: 1.6;
}

/* Footer */
.footer-deco {
  text-align: center;
  padding: 40rpx 0 20rpx;
}

.footer-text {
  font-size: 24rpx;
  color: #b8a88a;
  letter-spacing: 8rpx;
  font-family: serif;
}

/* SOS 卡片 */
.sos-card {
  border: 3rpx solid #c0392b;
  background: #fff5f5;
}

.sos-icon-wrap {
  background: #fde8e8;
}

.sos-title {
  color: #c0392b;
}

.sos-arrow {
  color: #c0392b;
}

/* SOS 悬浮按钮 */
.sos-fab {
  position: fixed;
  top: 80rpx;
  right: 32rpx;
  width: 88rpx;
  height: 88rpx;
  background: #c0392b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(192,57,43,0.5);
  z-index: 100;
}

.sos-fab-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
  letter-spacing: 1rpx;
}
</style>
