# 实现计划：银龄 AI 助手微信小程序 MVP

## 概述

基于 uni-app + Vue3 + TypeScript + Pinia 从零搭建微信小程序，实现 AI 问药、语音助手、健康提醒三大核心功能。采用分层架构（页面层 → 组件层 → Store 层 → 服务层 → Mock 层），优先完成核心数据流，再逐步接入外部服务。

## 任务

- [x] 1. 搭建 uni-app 项目脚手架与基础配置
  - 使用 `npx degit dcloudio/uni-preset-vue#vite-ts` 初始化 uni-app + Vue3 + TypeScript 项目
  - 配置 `vite.config.ts`，集成 UnoCSS（uni-app 版）
  - 安装并配置 Pinia（`@pinia/nuxt` 或直接 `pinia`）
  - 安装测试依赖：`vitest`、`@vue/test-utils`、`fast-check`
  - 配置 `vitest.config.ts`，设置 `environment: 'jsdom'`，添加 `setupFiles`
  - 创建 `src/mock/wx.ts`，Mock 微信 API（`chooseMedia`、`requestSubscribeMessage`、`setStorageSync`、`getStorageSync`、`RecorderManager`）
  - 创建 `src/mock/services.ts`，Mock OCR / LLM / TTS 服务
  - _需求：1.1、1.2、1.3_

- [x] 2. 定义 TypeScript 类型与核心接口
  - [x] 2.1 创建 `src/types/index.ts`，定义所有数据模型
    - 定义 `MedicationInfo`、`Reminder`、`ReminderCompletion`、`ChatMessage`、`AppSettings` 接口
    - 定义 `OcrResult`、`AsrResult` 接口
    - 定义 `CreateReminderDto` 类型
    - _需求：2.6、3.1、7.1_
  - [x] 2.2 创建 `src/types/services.ts`，定义服务接口
    - 定义 `OcrService`、`LlmService`、`TtsService`、`AsrService`、`ReminderService` 接口
    - _需求：2.2、3.1、4.1、5.3、7.3_

- [x] 3. 实现本地存储工具与 Mock 服务层
  - [x] 3.1 创建 `src/utils/storage.ts`，封装 wx.Storage 读写
    - 实现 `getStorage<T>(key: string): T | null` 和 `setStorage<T>(key: string, value: T): void`
    - 定义存储 Key 常量（`SILVER_REMINDERS`、`SILVER_MED_HISTORY`、`SILVER_CHAT_HISTORY`、`SILVER_SETTINGS`）
    - _需求：7.5_
  - [x] 3.2 创建 `src/mock/mockOcr.ts`，实现 Mock OCR 服务
    - 模拟 1-3 秒延迟，随机返回成功/失败结果，支持置信度配置
    - _需求：2.2、2.3_
  - [x] 3.3 创建 `src/mock/mockLlm.ts`，实现 Mock LLM 服务
    - `parseMedication` 返回固定结构的 `MedicationInfo`，总字数 ≤ 200 字
    - `chat` 返回固定回答，字数 ≤ 150 字
    - _需求：3.1、3.2、6.2_
  - [x] 3.4 创建 `src/mock/mockTts.ts`，实现 Mock TTS 服务
    - 实现 `speak(text, speed)`、`stop()`、`isPlaying` 响应式状态
    - _需求：4.1、4.2、4.3_
  - [x] 3.5 创建 `src/mock/mockAsr.ts`，实现 Mock ASR 服务
    - 模拟录音 → 识别流程，返回 `AsrResult`
    - _需求：6.1、6.5_

- [x] 4. 实现 Pinia Store 层
  - [x] 4.1 创建 `src/stores/medication.ts`
    - 实现状态机：`idle → capturing → ocr → llm → done | error`
    - 实现 `startCapture()`：调用 `wx.chooseMedia` → OCR → LLM 完整流程
    - 实现 `retry()`：从 `error` 状态回到 `idle`
    - 实现 `speakResult()`：调用 TTS 播报当前 `medicationInfo`
    - 处理 OCR 超时（5s）、LLM 超时（10s）、网络不可用三种错误
    - _需求：2.1、2.2、2.3、2.4、2.5、2.6、3.4_
  - [ ]* 4.2 为 medication store 编写属性测试
    - **属性 4：低质量识别结果触发错误提示（confidence < 0.6 时不调用 LLM）**
    - **验证需求：2.3、6.5**
    - **属性 5：OCR 成功后 LLM 被调用且参数包含 OCR 文字**
    - **验证需求：2.6**
    - **属性 6：处理中按钮被禁用（status 为 ocr/llm 时）**
    - **验证需求：2.5**
  - [x] 4.3 创建 `src/stores/voice.ts`
    - 实现 `isRecording`、`isProcessing`、`messages: ChatMessage[]` 状态
    - 实现 `startRecord()`、`stopRecord()` 方法
    - `messages` 超过 10 条时移除最旧记录
    - 实现提醒意图检测：识别"帮我设置提醒"等关键词后触发路由跳转
    - _需求：6.1、6.2、6.3、6.4、6.5、6.6、6.7_
  - [ ]* 4.4 为 voice store 编写属性测试
    - **属性 14：对话历史最多保留 10 条**
    - **验证需求：6.4**
    - **属性 15：提醒意图触发路由跳转**
    - **验证需求：6.7**
  - [x] 4.5 创建 `src/stores/reminder.ts`
    - 实现 `reminders: Reminder[]` 状态，初始化时从 `wx.getStorageSync` 加载
    - 实现 `createReminder(dto)`：验证时间 > 当前时间，持久化存储
    - 实现 `completeReminder(id)`：记录 `completedAt` 时间戳，状态设为 `completed`
    - 实现 `snoozeReminder(id)`：设置下次触发时间为当前时间 + 15 分钟
    - 实现 `toggleReminder(id)`：切换 `enabled` 状态
    - 实现 30 天外完成记录清理逻辑
    - _需求：7.3、7.4、7.5、9.3、9.4、9.6_
  - [ ]* 4.6 为 reminder store 编写属性测试
    - **属性 16：过去时间的提醒被拒绝**
    - **验证需求：7.3、7.4**
    - **属性 17：提醒数据持久化 Round Trip**
    - **验证需求：7.5**
    - **属性 19：完成操作记录时间戳并更新状态**
    - **验证需求：9.3**
    - **属性 20：Snooze 操作设置正确的下次触发时间（当前时间 + 15 分钟，误差 ≤ 1 秒）**
    - **验证需求：9.4**
    - **属性 21：30 天外的完成记录被清理**
    - **验证需求：9.6**

- [ ] 5. 检查点 — 确保所有 Store 测试通过
  - 确保所有测试通过，如有问题请向用户说明。

- [x] 6. 实现通用 UI 组件
  - [x] 6.1 创建 `src/components/FloatingMic.vue`
    - 使用 `position: fixed` 固定右下角，`min-width: 88pt`、`min-height: 88pt`
    - 实现长按逻辑：`@touchstart` + `@touchend` + 500ms 计时器
    - 按压 < 500ms 显示"请长按说话"提示
    - 接收 `hidden` prop，相机调用期间隐藏
    - 录音状态显示动效（脉冲动画）
    - _需求：5.1、5.2、5.3、5.4、5.5、5.6_
  - [ ]* 6.2 为 FloatingMic 编写属性测试
    - **属性 12：长按时间阈值控制录音触发（> 500ms 触发，< 500ms 不触发）**
    - **验证需求：5.3、5.5**
    - **属性 13：相机调用期间 FloatingMic 隐藏**
    - **验证需求：5.6**
    - **属性 2：按钮触摸区域不小于 88×88pt**
    - **验证需求：1.3、5.1**
  - [x] 6.3 创建 `src/components/LoadingOverlay.vue`
    - 全屏加载遮罩，显示加载动画和提示文案
    - _需求：2.5_
  - [x] 6.4 创建 `src/components/ErrorToast.vue`
    - 错误提示组件，支持自动消失和手动关闭
    - _需求：2.3、2.4、3.4、4.4、6.5、6.6_

- [x] 7. 实现 AI 问药功能页面
  - [x] 7.1 创建 `src/pages/medication/index.vue`（问药主页）
    - 大字体标题"AI 问药"（≥ 32pt）
    - "拍照识别"按钮（触摸区域 ≥ 88×88pt），处理中时禁用
    - 显示"你可以这样说"语音引导提示
    - 集成 `useMedicationStore`，监听 `status` 变化显示 `LoadingOverlay`
    - _需求：1.1、1.2、1.3、1.4、2.1、2.5_
  - [x] 7.2 创建 `src/pages/medication/result.vue`（解析结果页）
    - 分区展示药品名称（≥ 32pt）、用法用量、注意事项（≥ 18pt）
    - `isPrescription=true` 时显示"请遵医嘱，勿自行用药"警示文案
    - 提供"重新拍照"和"语音播报"/"停止播报"两个操作按钮（≥ 88×88pt）
    - 进入页面时若 `autoSpeak=true` 自动触发 TTS
    - TTS 播放中显示"停止播报"，停止后恢复"语音播报"
    - _需求：3.3、3.5、4.1、4.2、4.3、4.4、4.5_
  - [ ]* 7.3 为结果页编写属性测试
    - **属性 3：TTS 调用速度参数始终为 0.8**
    - **验证需求：1.5、4.1、6.3**
    - **属性 9：处方药标识触发警示文案**
    - **验证需求：3.5**
    - **属性 10：自动播报受 autoSpeak 设置控制**
    - **验证需求：4.5**
    - **属性 11：TTS 播放状态与 UI 同步**
    - **验证需求：4.2、4.3**

- [x] 8. 实现语音助手功能页面
  - [x] 8.1 创建 `src/pages/voice/index.vue`（语音对话页）
    - 气泡形式展示对话历史（用户气泡右对齐，AI 气泡左对齐），字体 ≥ 18pt
    - 显示"你可以这样说"引导文案
    - 集成 `useVoiceStore`，显示录音状态和处理状态
    - ASR 识别失败时显示"没有听清，请再说一遍"
    - LLM 超时时显示"AI 思考中，请稍候"
    - _需求：1.1、1.4、6.1、6.2、6.3、6.4、6.5、6.6_
  - [ ]* 8.2 为语音助手页面编写单元测试
    - 测试对话气泡渲染（用户/AI 角色区分）
    - 测试错误提示文案显示逻辑
    - _需求：6.5、6.6_

- [x] 9. 实现健康提醒功能页面
  - [x] 9.1 创建 `src/pages/reminder/index.vue`（提醒列表页）
    - 大字体卡片展示提醒列表（名称 ≥ 18pt，下次提醒时间）
    - 每张卡片包含启用/停用开关（触摸区域 ≥ 88×88pt）
    - 待完成与已完成状态用不同颜色区分
    - 提供"新建提醒"入口按钮
    - _需求：7.6、9.5_
  - [x] 9.2 创建 `src/pages/reminder/create.vue`（创建提醒页）
    - 表单字段：提醒名称（≥ 18pt，含语音输入选项）、提醒时间、重复周期、备注
    - 提交时验证时间 > 当前时间，不合法时高亮时间字段并提示
    - 首次创建时调用 `wx.requestSubscribeMessage` 申请订阅权限
    - 用户拒绝授权时显示提示并继续保存
    - 支持从语音助手跳转时预填时间和内容
    - _需求：7.1、7.2、7.3、7.4、7.5、8.1、8.2_
  - [x] 9.3 创建 `src/pages/reminder/detail.vue`（提醒详情页）
    - 显示提醒详情和最近完成记录
    - "已完成"按钮和"稍后提醒（15分钟后）"按钮（触摸区域 ≥ 88×88pt）
    - 支持通知启动参数解析，自动跳转至对应提醒详情
    - _需求：9.1、9.2、9.3、9.4_
  - [ ]* 9.4 为提醒页面编写单元测试
    - 测试时间验证错误提示渲染
    - 测试通知启动参数解析后路由跳转
    - 测试待完成/已完成状态颜色区分
    - _需求：7.4、9.1、9.5_

- [x] 10. 实现 App.vue 全局配置与路由
  - 在 `App.vue` 中全局注册 `FloatingMic` 组件
  - 配置 `pages.json` 路由表（index、medication/index、medication/result、voice/index、reminder/index、reminder/create、reminder/detail）
  - 实现 `onError` 全局错误边界（MVP 阶段 `console.error`）
  - 实现首页 `src/pages/index/index.vue`：三大功能入口卡片（AI 问药、语音助手、健康提醒）
  - _需求：1.1、1.2、1.3、5.1、5.2、5.6_

- [ ] 11. 适老化样式规范验证
  - [x] 11.1 创建 `src/utils/a11y.ts`，导出字体和触摸区域常量
    - `MIN_BODY_FONT_PX = 24`、`MIN_TITLE_FONT_PX = 43`、`MIN_TOUCH_PX = 117`
    - _需求：1.1、1.2、1.3_
  - [ ]* 11.2 为适老化规范编写属性测试
    - **属性 1：所有页面正文字体 ≥ 18pt（24px），标题 ≥ 32pt（43px）**
    - **验证需求：1.1、1.2、7.2**
    - **属性 2：所有可交互按钮触摸区域 ≥ 88×88pt（117px）**
    - **验证需求：1.3、5.1、9.2**

- [x] 12. 实现真实服务层（替换 Mock）
  - [x] 12.1 创建 `src/services/ocr.ts`，封装腾讯云 OCR API
    - 实现 `recognize(imageBase64)`，5 秒超时，返回 `OcrResult`
    - _需求：2.2、2.3_
  - [x] 12.2 创建 `src/services/llm.ts`，封装通义千问 API
    - 实现 `parseMedication(ocrText)`，10 秒超时，系统提示词约束输出 ≤ 200 字
    - 实现 `chat(messages)`，8 秒超时，约束回答 ≤ 150 字
    - _需求：3.1、3.2、6.2_
  - [x] 12.3 创建 `src/services/tts.ts`，封装讯飞 WebSocket TTS API
    - 实现 `speak(text, speed = 0.8)`、`stop()`、响应式 `isPlaying`
    - TTS 失败时降级为纯文字展示
    - _需求：1.5、4.1、4.2、4.3、4.4_
  - [x] 12.4 创建 `src/services/asr.ts`，封装微信 RecorderManager
    - 实现 `startRecording()`、`stopRecording()`，3 秒超时
    - _需求：6.1、6.5_
  - [x] 12.5 创建 `src/services/push.ts`，封装微信订阅消息
    - 实现 `requestSubscription()`、`sendReminder(reminder)`
    - _需求：8.1、8.3、8.4、8.5_

- [ ] 13. 最终检查点 — 确保所有测试通过
  - 运行 `vitest --run` 确保所有单元测试和属性测试通过
  - 确保所有测试通过，如有问题请向用户说明。

## 备注

- 标有 `*` 的子任务为可选测试任务，可跳过以加快 MVP 进度
- 每个任务均引用具体需求条款，确保可追溯性
- 属性测试每个至少运行 100 次随机输入（`{ numRuns: 100 }`）
- 任务 12 的真实服务层需要配置对应的 API Key（腾讯云 OCR、通义千问、讯飞 TTS）
- Mock 服务（任务 3）在真实服务接入前作为完整替代，保证开发阶段可独立运行
