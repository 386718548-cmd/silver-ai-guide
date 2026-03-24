import type { Contact, LocationInfo, NotifyResult, SosRecord } from '../types/index'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'

// 腾讯地图逆地理编码（可选，无 Key 时跳过）
const TENCENT_MAP_KEY = import.meta.env.VITE_TENCENT_MAP_KEY || ''

async function getLocation(): Promise<LocationInfo> {
  return new Promise((resolve) => {
    uni.getLocation({
      type: 'gcj02',
      success: async (res) => {
        const { latitude, longitude } = res
        let address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`

        // 尝试逆地理编码
        if (TENCENT_MAP_KEY) {
          try {
            const geoRes = await new Promise<any>((ok, fail) => {
              uni.request({
                url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${TENCENT_MAP_KEY}&output=json`,
                success: ok,
                fail,
              })
            })
            const addr = geoRes.data?.result?.address
            if (addr) address = addr
          } catch {
            // 逆地理编码失败，使用坐标
          }
        }

        resolve({ latitude, longitude, address, success: true })
      },
      fail: () => {
        resolve({ latitude: 0, longitude: 0, address: '位置获取失败', success: false })
      },
    })
  })
}

async function notifyContacts(contacts: Contact[], location: LocationInfo): Promise<NotifyResult[]> {
  const results: NotifyResult[] = []

  for (const contact of contacts) {
    try {
      // 微信订阅消息通知（需要用户授权订阅模板）
      await new Promise<void>((resolve, reject) => {
        uni.requestSubscribeMessage({
          tmplIds: ['SOS_TEMPLATE_ID'], // 需在微信公众平台配置
          success: () => resolve(),
          fail: (err: any) => reject(err),
        })
      })
      results.push({ contactId: contact.id, contactName: contact.name, success: true })
    } catch (e: any) {
      results.push({
        contactId: contact.id,
        contactName: contact.name,
        success: false,
        failReason: e?.errMsg || '通知发送失败',
      })
    }
  }

  return results
}

function saveRecord(record: SosRecord): void {
  const records = getStorage<SosRecord[]>(STORAGE_KEYS.SILVER_SOS_RECORDS) ?? []
  records.push(record)
  setStorage(STORAGE_KEYS.SILVER_SOS_RECORDS, records)
}

async function trigger(contacts: Contact[]): Promise<SosRecord> {
  const location = await getLocation()
  const notifyResults = contacts.length > 0
    ? await notifyContacts(contacts, location)
    : []

  const successCount = notifyResults.filter(r => r.success).length
  const status: SosRecord['status'] =
    notifyResults.length === 0 ? 'failed'
    : successCount === notifyResults.length ? 'success'
    : successCount > 0 ? 'partial'
    : 'failed'

  const record: SosRecord = {
    id: `sos_${Date.now()}`,
    triggeredAt: Date.now(),
    location,
    notifyResults,
    status,
  }

  saveRecord(record)
  return record
}

export const sosService = { getLocation, notifyContacts, saveRecord, trigger }
