<template>
  <view class="page">
    <view class="section-title"><text>选择界面风格</text></view>
    <view class="subtitle"><text>切换后立即生效，下次启动自动恢复</text></view>

    <view class="theme-list">
      <view
        v-for="theme in THEME_CONFIGS"
        :key="theme.id"
        class="theme-card"
        :class="{ active: themeStore.currentTheme === theme.id }"
        :style="{ background: theme.vars['--theme-bg'], borderColor: themeStore.currentTheme === theme.id ? theme.vars['--theme-primary'] : '#d4c4a8' }"
        @tap="selectTheme(theme.id)"
      >
        <!-- 色块预览 -->
        <view class="color-preview">
          <view class="color-block" :style="{ background: theme.vars['--theme-primary'] }" />
          <view class="color-block" :style="{ background: theme.vars['--theme-accent'] }" />
          <view class="color-block" :style="{ background: theme.vars['--theme-bg'] }" />
          <view class="color-block" :style="{ background: theme.vars['--theme-card'] }" />
        </view>

        <view class="theme-info">
          <text class="theme-name" :style="{ color: theme.vars['--theme-text'] }">{{ theme.name }}</text>
          <view v-if="themeStore.currentTheme === theme.id" class="check-badge" :style="{ background: theme.vars['--theme-primary'] }">
            <text class="check-text">✓ 当前</text>
          </view>
        </view>

        <!-- 迷你卡片预览 -->
        <view class="mini-preview" :style="{ background: theme.vars['--theme-card'], borderColor: theme.vars['--theme-primary'] + '44' }">
          <view class="mini-dot" :style="{ background: theme.vars['--theme-primary'] }" />
          <text class="mini-text" :style="{ color: theme.vars['--theme-text'] }">银龄 AI 助手</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore, THEME_CONFIGS } from '../../stores/themeStore'
import type { ThemeId } from '../../types/index'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.loadTheme()
})

function selectTheme(id: ThemeId) {
  themeStore.applyTheme(id)
  uni.showToast({ title: '主题已切换', icon: 'success', duration: 1000 })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f3eb;
  padding: 32rpx 32rpx 80rpx;
}

.section-title {
  padding: 8rpx 0 8rpx;
}

.section-title text {
  font-size: 36rpx;
  font-weight: bold;
  color: #1a1a1a;
  font-family: serif;
}

.subtitle {
  margin-bottom: 32rpx;
}

.subtitle text {
  font-size: 26rpx;
  color: #b8a88a;
}

.theme-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.theme-card {
  border-radius: 20rpx;
  border: 4rpx solid #d4c4a8;
  padding: 28rpx;
  transition: all 0.2s;
}

.theme-card.active {
  border-width: 4rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.12);
}

.color-preview {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.color-block {
  width: 48rpx;
  height: 48rpx;
  border-radius: 8rpx;
  border: 2rpx solid rgba(0,0,0,0.08);
}

.theme-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.theme-name {
  font-size: 34rpx;
  font-weight: bold;
  font-family: serif;
}

.check-badge {
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
}

.check-text {
  font-size: 24rpx;
  color: #fff;
}

.mini-preview {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 24rpx;
  border-radius: 12rpx;
  border: 2rpx solid;
}

.mini-dot {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.mini-text {
  font-size: 28rpx;
  font-family: serif;
}
</style>
