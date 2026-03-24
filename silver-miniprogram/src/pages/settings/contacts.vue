<template>
  <view class="page">
    <!-- 联系人列表 -->
    <view class="section-title"><text>紧急联系人</text></view>

    <view v-if="contactStore.contacts.length === 0" class="empty">
      <text class="empty-text">暂无紧急联系人，请添加</text>
    </view>

    <view v-for="c in contactStore.contacts" :key="c.id" class="contact-card">
      <view class="contact-info">
        <text class="contact-name">{{ c.name }}</text>
        <text class="contact-relation">{{ c.relation }}</text>
        <text class="contact-phone">{{ c.phone }}</text>
      </view>
      <view class="delete-btn" @tap="removeContact(c.id)">
        <text class="delete-text">删除</text>
      </view>
    </view>

    <!-- 上限提示 -->
    <view v-if="contactStore.contacts.length >= 5" class="limit-tip">
      <text class="limit-text">最多添加 5 位紧急联系人</text>
    </view>

    <!-- 新增表单 -->
    <view v-if="contactStore.contacts.length < 5" class="form-card">
      <view class="section-title"><text>添加联系人</text></view>

      <view class="form-item">
        <text class="form-label">姓名</text>
        <input
          v-model="form.name"
          class="form-input"
          placeholder="请输入姓名"
          :placeholder-style="'color:#b8a88a'"
        />
      </view>

      <view class="form-item">
        <text class="form-label">手机号</text>
        <input
          v-model="form.phone"
          class="form-input"
          :class="{ error: phoneError }"
          placeholder="请输入11位手机号"
          :placeholder-style="'color:#b8a88a'"
          type="number"
          maxlength="11"
        />
        <text v-if="phoneError" class="error-tip">请输入正确的手机号码</text>
      </view>

      <view class="form-item">
        <text class="form-label">关系</text>
        <input
          v-model="form.relation"
          class="form-input"
          placeholder="如：儿子、女儿、朋友"
          :placeholder-style="'color:#b8a88a'"
        />
      </view>

      <view class="add-btn" @tap="addContact">
        <text class="add-btn-text">+ 添加</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useContactStore } from '../../stores/contactStore'
import { contactService } from '../../services/contactService'

const contactStore = useContactStore()
const phoneError = ref(false)
const form = ref({ name: '', phone: '', relation: '' })

onMounted(() => {
  contactStore.load()
})

function addContact() {
  phoneError.value = false
  if (!form.value.name.trim()) {
    uni.showToast({ title: '请输入姓名', icon: 'none' })
    return
  }
  if (!contactService.validate(form.value.phone)) {
    phoneError.value = true
    return
  }
  if (!form.value.relation.trim()) {
    uni.showToast({ title: '请输入关系', icon: 'none' })
    return
  }
  try {
    contactStore.add({
      name: form.value.name.trim(),
      phone: form.value.phone.trim(),
      relation: form.value.relation.trim(),
    })
    form.value = { name: '', phone: '', relation: '' }
    uni.showToast({ title: '添加成功', icon: 'success' })
  } catch (e: any) {
    uni.showToast({ title: e.message || '添加失败', icon: 'none' })
  }
}

function removeContact(id: string) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这位联系人吗？',
    success: (res) => {
      if (res.confirm) {
        contactStore.remove(id)
        uni.showToast({ title: '已删除', icon: 'success' })
      }
    },
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f7f3eb;
  padding: 32rpx 32rpx 120rpx;
}

.section-title {
  padding: 24rpx 0 16rpx;
}

.section-title text {
  font-size: 32rpx;
  font-weight: bold;
  color: #1a1a1a;
  font-family: serif;
  letter-spacing: 2rpx;
}

.empty {
  padding: 48rpx;
  text-align: center;
}

.empty-text {
  font-size: 30rpx;
  color: #b8a88a;
}

.contact-card {
  display: flex;
  align-items: center;
  background: #fff9f0;
  border: 2rpx solid #d4c4a8;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
  min-height: 88rpx;
}

.contact-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.contact-name {
  font-size: 34rpx;
  font-weight: bold;
  color: #1a1a1a;
}

.contact-relation {
  font-size: 26rpx;
  color: #7a6a55;
}

.contact-phone {
  font-size: 28rpx;
  color: #5a4a3a;
}

.delete-btn {
  min-width: 88rpx;
  min-height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff0f0;
  border-radius: 12rpx;
  border: 2rpx solid #c0392b44;
}

.delete-text {
  font-size: 28rpx;
  color: #c0392b;
}

.limit-tip {
  text-align: center;
  padding: 24rpx;
}

.limit-text {
  font-size: 28rpx;
  color: #c0392b;
}

.form-card {
  background: #fff9f0;
  border: 2rpx solid #d4c4a8;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-top: 16rpx;
}

.form-item {
  margin-bottom: 28rpx;
}

.form-label {
  display: block;
  font-size: 30rpx;
  color: #5a4a3a;
  margin-bottom: 12rpx;
}

.form-input {
  width: 100%;
  height: 88rpx;
  background: #f7f3eb;
  border: 2rpx solid #d4c4a8;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 32rpx;
  color: #1a1a1a;
  box-sizing: border-box;
}

.form-input.error {
  border-color: #c0392b;
  background: #fff0f0;
}

.error-tip {
  display: block;
  font-size: 26rpx;
  color: #c0392b;
  margin-top: 8rpx;
}

.add-btn {
  height: 88rpx;
  background: #c0392b;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8rpx;
}

.add-btn-text {
  font-size: 34rpx;
  color: #fff;
  letter-spacing: 4rpx;
}
</style>
