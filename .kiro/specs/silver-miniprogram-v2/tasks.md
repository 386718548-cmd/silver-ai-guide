# 实现计划：银龄 AI 助手小程序 v2

## 概述

基于现有 uni-app + Vue3 + TypeScript + Pinia 项目，增量实现四项新功能：方言识别、UI 主题切换、AI 情感陪伴聊天、紧急救助系统。所有新增代码遵循现有分层架构（pages / stores / services / types）。

## 任务

- [x] 1. 扩展类型定义与基础设施
  - 在 `silver-miniprogram/src/types/index.ts` 中追加 `DialectMode`、`ThemeId`、`ThemeConfig`、`CompanionMessage`、`UserProfile`、`Contact`、`CreateContactDto`、`LocationInfo`、`NotifyResult`、`SosRecord` 类型，并扩展 `AppSettings` 新增 `dialectMode`、`companionAutoTts`、`theme` 字段
  - 在 `silver-miniprogram/src/utils/storage.ts` 中追加 v2 新增的六个存储 Key 常量：`silver_theme`、`silver_dialect_mode`、`silver_companion_history`、`silver_companion_profile`、`silver_contacts`、`silver_sos_records`
  - _需求：1.5、3.4、5.7、9.5、10.1_

- [x] 2. 实现主题存储与 CSS 变量系统
  - [x] 2.1 创建 `silver-miniprogram/src/stores/themeStore.ts`
    - 定义四种主题的 `THEME_CONFIGS` 常量（含完整五个 CSS 变量色值）
    - 实现 `applyTheme(id)` 方法：写入 CSS 变量到 `page` 选择器 + `wx.setStorageSync('silver_theme', id)`
    - 实现 `loadTheme()` 方法：从 storage 读取，失败时默认 `ink` 主题
    - _需求：3.1、3.4、3.5、3.6、3.7、4.1、4.2、4.3、4.4_

  - [ ]* 2.2 为主题存储编写属性测试
    - **属性 6：主题配置包含五个完整 CSS 变量**
    - **验证需求：3.6、4.6**
    - **属性 7：主题色值与规范完全匹配**
    - **验证需求：4.1、4.2、4.3、4.4**
    - **属性 8：主题选择持久化 Round Trip**
    - **验证需求：3.4**

  - [x] 2.3 更新 `silver-miniprogram/src/uni.scss`
    - 在 `page` 选择器中声明五个 `--theme-*` CSS 变量，默认值使用水墨养生风色值
    - _需求：3.6、4.6_

  - [x] 2.4 在 `silver-miniprogram/src/App.vue` 的 `onLaunch` 中调用 `themeStore.loadTheme()`
    - 确保启动时主题在首页渲染前完成应用，避免闪烁
    - _需求：3.5_

- [x] 3. 实现方言 ASR 服务
  - [x] 3.1 创建 `silver-miniprogram/src/services/dialectAsr.ts`
    - 定义 `DIALECT_LANG_MAP` 常量（mandarin/cantonese/hokkien/sichuan → 讯飞语言代码）
    - 实现讯飞 WebSocket 鉴权（HMAC-SHA256 签名 URL 生成）
    - 实现 `startRecording(mode)` / `stopRecording()` 方法，8 秒超时后自动降级
    - 降级逻辑：调用现有 `asrService` 并向调用方抛出带 `fallback: true` 标记的结果
    - _需求：1.2、1.3、1.7、1.8、1.9_

  - [ ]* 3.2 为方言 ASR 服务编写属性测试
    - **属性 1：方言模式正确传递给 ASR 服务**
    - **验证需求：1.2、2.4**
    - **属性 2：方言语言偏好持久化 Round Trip**
    - **验证需求：1.5**
    - **属性 3：低置信度识别结果触发错误提示且不调用 LLM**
    - **验证需求：1.6、2.5**
    - **属性 4：方言服务失败时自动降级到普通话 ASR**
    - **验证需求：1.7、1.9**
    - **属性 5：方言识别结果以普通话文字传入 LLM**
    - **验证需求：2.3、5.4_

- [x] 4. 更新语音助手页面集成方言识别
  - [x] 4.1 更新 `silver-miniprogram/src/pages/voice/index.vue`
    - 在录音界面顶部新增方言模式选择器（四个选项，大字体 ≥32rpx）
    - 切换方言模式时调用 `wx.setStorageSync('silver_dialect_mode', mode)` 持久化
    - 页面 `onShow` 时从 storage 恢复上次选择的方言模式
    - 录音时根据当前模式调用 `dialectAsrService` 或 `asrService`
    - 置信度 < 0.5 或文字为空时显示"没有听清，请再说一遍"，不调用 LLM
    - 降级时显示"方言识别暂不可用，已切换为普通话识别"
    - _需求：1.1、1.4、1.5、1.6、1.7、2.1、2.2、2.3_

  - [x] 4.2 更新 `silver-miniprogram/src/components/FloatingMic.vue`
    - 长按录音时读取当前方言模式（从 storage），使用对应服务识别
    - _需求：2.4_

- [x] 5. 实现情感陪伴 LLM 服务
  - [x] 5.1 创建 `silver-miniprogram/src/services/companionLlm.ts`
    - 实现 `chat(messages, userProfile?)` 方法，调用通义千问 API（qwen-turbo）
    - 系统提示词中包含"银龄"人格标识，并注入当前时间段（早晨/下午/晚上）
    - 实现 `generateGreeting(timeOfDay)` 方法
    - 实现 `detectNegativeEmotion(text)` 本地关键词检测（孤独、难过、不舒服等）
    - _需求：5.3、5.5、5.6、6.1、6.4_

  - [ ]* 5.2 为情感陪伴 LLM 服务编写属性测试
    - **属性 9：陪伴聊天回复字数不超过 200 字**
    - **验证需求：5.3**
    - **属性 12：陪伴聊天系统提示词包含"银龄"人格标识**
    - **验证需求：6.1**

- [x] 6. 实现情感陪伴聊天 Store
  - [x] 6.1 创建 `silver-miniprogram/src/stores/companionStore.ts`
    - 从 storage 加载历史消息（最近 50 条）
    - 实现 `sendMessage(content)` 方法：添加用户消息 → 调用 `companionLlmService.chat()` → 添加 AI 消息 → 可选 TTS 朗读（speed=0.8）
    - 消息数组超过 50 条时移除最旧记录，并持久化到 `silver_companion_history`
    - 实现 `sendTopicPrompt(topic)` 方法：将话题文本作为用户消息发送
    - 实现 `initGreeting()` 方法：根据当前时间段生成问候语
    - 记录 `userProfile.preferredTopics`，持久化到 `silver_companion_profile`
    - _需求：5.2、5.3、5.6、5.7、5.8、6.2、6.3、6.6_

  - [ ]* 6.2 为情感陪伴 Store 编写属性测试
    - **属性 10：陪伴聊天历史记录上限为 50 条**
    - **验证需求：5.7**
    - **属性 11：陪伴聊天 TTS 调用受设置控制**
    - **验证需求：5.8**
    - **属性 13：话题引导按钮点击触发对应用户消息**
    - **验证需求：6.3**

- [x] 7. 实现情感陪伴聊天页面
  - [x] 7.1 创建 `silver-miniprogram/src/pages/companion/index.vue`
    - 气泡式对话列表（用户消息靠右，AI 消息靠左），字体 ≥18pt
    - 页面 `onLoad` 时调用 `companionStore.initGreeting()` 发送时间段问候语
    - 底部输入区：文字输入框 + 语音输入按钮（调用方言识别）
    - 四个话题引导快捷按钮（聊聊今天 / 讲个故事 / 健康小知识 / 想念家人）
    - LLM 响应超过 10 秒时显示"AI 正在思考中..."
    - 检测到负面情绪时，AI 回复下方显示"需要帮助？一键联系家人"入口，点击跳转 `/pages/sos/index`
    - _需求：5.1、5.2、5.4、5.6、5.9、5.10、6.2、6.3、6.5_

- [x] 8. 实现联系人服务与 Store
  - [x] 8.1 创建 `silver-miniprogram/src/services/contactService.ts`
    - 实现 `list()` / `add(dto)` / `update(id, dto)` / `remove(id)` / `validate(phone)` 方法
    - `validate(phone)` 规则：长度 11、全数字、首字符为 '1'
    - `add()` 超过 5 位时抛出错误
    - 所有写操作后调用 `wx.setStorageSync('silver_contacts', ...)` 持久化
    - _需求：9.1、9.3、9.4、9.5_

  - [ ]* 8.2 为联系人服务编写属性测试
    - **属性 17：手机号码验证规则**
    - **验证需求：9.3、9.4**
    - **属性 18：联系人数量上限为 5 位**
    - **验证需求：9.1**
    - **属性 19：联系人数据持久化 Round Trip**
    - **验证需求：9.5**

  - [x] 8.3 创建 `silver-miniprogram/src/stores/contactStore.ts`
    - 启动时从 storage 加载联系人列表
    - 封装 `contactService` 的增删改查操作，暴露响应式 `contacts` 列表
    - _需求：9.1、9.5_

- [x] 9. 实现联系人管理页面
  - [x] 9.1 创建 `silver-miniprogram/src/pages/settings/contacts.vue`
    - 展示联系人列表（姓名、手机号、关系），支持删除
    - 新增联系人表单：姓名、手机号（11位验证）、关系三个字段
    - 手机号格式错误时高亮输入框并显示"请输入正确的手机号码"
    - 已有 5 位时隐藏新增按钮并提示"最多添加 5 位紧急联系人"
    - 触摸区域 ≥88×88pt，字体 ≥18pt
    - _需求：9.1、9.2、9.3、9.4、9.5_

- [x] 10. 实现 SOS 服务
  - [x] 10.1 创建 `silver-miniprogram/src/services/sosService.ts`
    - 实现 `getLocation()` 方法：封装 `wx.getLocation`，失败时返回 `{ success: false, address: '位置获取失败' }`
    - 实现逆地理编码（腾讯地图 API），将坐标转为省市区街道文字
    - 实现 `notifyContacts(contacts, location)` 方法：调用 `wx.requestSubscribeMessage` 向每位联系人发送通知
    - 实现 `trigger()` 方法：串联 getLocation → notifyContacts → saveRecord 完整流程
    - 实现 `saveRecord(record)` 方法：持久化到 `silver_sos_records`
    - _需求：8.1、8.2、8.3、8.4、8.5、8.8、10.1_

  - [ ]* 10.2 为 SOS 服务编写属性测试
    - **属性 15：SOS 触发时调用位置 API 并通知所有联系人**
    - **验证需求：8.1、8.3、8.7**
    - **属性 16：位置获取失败时 SOS 通知仍然发送**
    - **验证需求：8.5**

- [x] 11. 实现 SOS Store
  - [x] 11.1 创建 `silver-miniprogram/src/stores/sosStore.ts`
    - 管理 SOS 状态机：`idle → countdown → triggering → locating → notifying → done/partial`
    - 实现 `startCountdown()` 方法：10 秒倒计时，每秒调用 `wx.vibrateShort()`
    - 实现 `cancel()` 方法：清除定时器，状态回到 `idle`，不触发任何通知
    - 实现 `confirmTrigger()` 方法：倒计时结束后调用 `sosService.trigger()`
    - 从 storage 加载历史记录，实现 `cleanOldRecords()` 清除 90 天前数据
    - 历史记录展示时按 `triggeredAt` 降序，最多取 20 条
    - _需求：7.3、7.5、7.6、7.7、10.1、10.2、10.3_

  - [ ]* 11.2 为 SOS Store 编写属性测试
    - **属性 14：SOS 取消操作不触发通知**
    - **验证需求：7.6**
    - **属性 20：SOS 历史记录持久化 Round Trip 且包含完整字段**
    - **验证需求：10.1、10.5**
    - **属性 21：SOS 历史记录按时间倒序且最多展示 20 条**
    - **验证需求：10.2**
    - **属性 22：SOS 历史记录自动清除 90 天前数据**
    - **验证需求：10.3**

- [x] 12. 检查点 — 确保所有测试通过
  - 确保所有测试通过，如有问题请向用户说明。

- [x] 13. 实现 SOS 触发页面
  - [x] 13.1 创建 `silver-miniprogram/src/pages/sos/index.vue`
    - 全屏红色背景，居中显示倒计时数字（≥80rpx），下方"取消"按钮（≥88×88pt）
    - 页面 `onLoad` 时自动调用 `sosStore.startCountdown()`
    - 倒计时结束后调用 `sosStore.confirmTrigger()`，展示通知结果（已通知联系人列表）
    - 联系人列表为空时跳转 `/pages/settings/contacts` 并提示"尚未设置紧急联系人"
    - 通知全部失败时显示联系人电话号码并提示"请拨打 120 或直接联系家人"
    - _需求：7.3、7.4、7.5、7.6、7.7、8.6、8.7、8.8_

  - [x] 13.2 创建 `silver-miniprogram/src/pages/sos/history.vue`
    - 以大字体卡片形式展示 SOS 历史记录（触发时间 + 位置 + 通知状态）
    - 成功通知用绿色标识，失败用红色标识
    - 调用 `sosStore.cleanOldRecords()` 清除 90 天前数据
    - _需求：10.2、10.3、10.4、10.5_

- [x] 14. 更新首页与路由配置
  - [x] 14.1 更新 `silver-miniprogram/src/pages/index/index.vue`
    - 在现有三张功能卡片后新增"AI 陪伴"卡片（图标 💬，描述"聊聊天，说说心里话"，路由 `/pages/companion/index`）
    - 新增"紧急救助"卡片（图标 🆘，描述"一键求救，守护安全"，红色强调边框，路由 `/pages/sos/index`）
    - 右上角新增常驻 SOS 快捷按钮（红色圆形，固定定位，触摸区域 ≥88×88pt）
    - _需求：5.1、7.1、7.2_

  - [x] 14.2 更新 `silver-miniprogram/src/pages.json`
    - 新增四条路由：`pages/companion/index`、`pages/sos/index`（红色导航栏）、`pages/sos/history`、`pages/settings/contacts`
    - _需求：5.1、7.1、9.2、10.2_

- [x] 15. 最终检查点 — 确保所有测试通过
  - 确保所有测试通过，如有问题请向用户说明。

## 备注

- 标有 `*` 的子任务为可选测试任务，可跳过以加快 MVP 交付
- 每个任务均引用具体需求条款，确保可追溯性
- 属性测试使用 fast-check，最少 100 次迭代（`{ numRuns: 100 }`）
- 单元测试使用 Vitest + vi.mock 模拟微信 API 和第三方服务
- 实现时遵循现有代码风格：Pinia defineStore + Composition API + TypeScript 严格类型
