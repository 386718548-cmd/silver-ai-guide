import type { Reminder } from '../types/index'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'

// 微信订阅消息模板 ID（需在微信公众平台配置）
const HEALTH_REMINDER_TEMPLATE_ID = 'health_reminder_template'

/**
 * 申请订阅消息权限
 * 返回是否授权成功
 */
export async function requestSubscription(): Promise<boolean> {
  return new Promise(resolve => {
    uni.requestSubscribeMessage({
      tmplIds: [HEALTH_REMINDER_TEMPLATE_ID],
      success: (res: any) => {
        const accepted = res[HEALTH_REMINDER_TEMPLATE_ID] === 'accept'
        setStorage(STORAGE_KEYS.SILVER_SUBSCRIPTION, accepted)
        resolve(accepted)
      },
      fail: () => {
        resolve(false)
      },
    })
  })
}

/**
 * 检查是否已授权订阅
 */
export function isSubscribed(): boolean {
  return getStorage<boolean>(STORAGE_KEYS.SILVER_SUBSCRIPTION) === true
}

/**
 * 发送提醒通知（需要服务端支持，此处为客户端触发逻辑）
 * 实际生产中应由服务端在提醒时间到达时调用微信服务端 API 发送
 */
export async function sendReminder(reminder: Reminder): Promise<void> {
  // MVP 阶段：使用本地通知模拟
  // 实际需要服务端调用 https://api.weixin.qq.com/cgi-bin/message/subscribe/send
  uni.showToast({
    title: `提醒：${reminder.name}`,
    icon: 'none',
    duration: 3000,
  })
}

/**
 * 重复提醒触发前重新申请订阅权限（微信机制限制）
 */
export async function renewSubscriptionForRepeat(reminder: Reminder): Promise<void> {
  if (!reminder.enabled || reminder.repeatType === 'once') return
  await requestSubscription()
}
