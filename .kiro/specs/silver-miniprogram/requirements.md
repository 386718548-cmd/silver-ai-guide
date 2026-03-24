# 需求文档

## 简介

银龄 AI 助手是一款面向中老年用户的微信小程序，基于 uni-app + Vue3 + TypeScript 技术栈开发。针对老年人"看不清、记不住、不会用"三大痛点，提供适老化 AI 服务。

MVP 阶段聚焦三大核心功能：**AI 问药**（拍照识别药品说明书）、**语音助手**（全局悬浮语音交互）、**健康提醒**（用药与健康事项提醒推送）。完整产品愿景还包括阅读放大镜、兴趣学堂、记忆相册三大功能，以及月卡/年卡/次卡变现体系。

目标用户：
- 活力老人（55-70岁）：学习新知识、记录生活
- 高龄老人（70岁以上）：用药安全、紧急联系
- 中间子女（30-50岁）：远程照看父母、代付费用

---

## 词汇表

- **小程序**：基于微信平台运行的 uni-app + Vue3 应用
- **OCR_Service**：腾讯云 OCR 文字识别服务
- **LLM_Service**：通义千问大模型服务，负责语义理解与回答生成
- **TTS_Service**：讯飞语音合成服务，负责将文字转为语音播报
- **ASR_Service**：微信小程序内置语音识别服务，负责将语音转为文字
- **Reminder_Service**：健康提醒管理服务，负责提醒的创建、存储与触发
- **Push_Service**：微信订阅消息推送服务
- **MedicationHelper**：AI 问药功能模块
- **VoiceAssistant**：语音助手功能模块
- **HealthReminder**：健康提醒功能模块
- **FloatingMic**：全局悬浮麦克风按钮组件
- **用户**：使用本小程序的老年人或其子女
- **Mock_API**：MVP 阶段用于模拟后端响应的本地接口层

---

## 需求

### 需求 1：适老化基础设计规范

**用户故事：** 作为老年用户，我希望小程序的字体、按钮和交互符合老年人使用习惯，以便我能轻松看清内容并准确操作。

#### 验收标准

1. THE 小程序 SHALL 在所有页面将正文字体大小设置为不小于 18pt（约 24px）。
2. THE 小程序 SHALL 在所有页面将标题字体大小设置为不小于 32pt（约 43px）。
3. THE 小程序 SHALL 将所有可交互按钮的触摸区域设置为不小于 88×88pt（约 117×117px）。
4. THE 小程序 SHALL 在每个功能页面提供"你可以这样说"语音引导提示文案。
5. THE TTS_Service SHALL 以默认 0.8 倍速播报所有语音内容。
6. IF 用户设备系统字体大小已放大，THEN THE 小程序 SHALL 保持布局不错位，文字不截断。

---

### 需求 2：AI 问药 — 拍照 OCR 识别

**用户故事：** 作为老年用户，我希望拍摄药品说明书后能自动识别文字，以便我不需要手动输入就能获取药品信息。

#### 验收标准

1. WHEN 用户在 MedicationHelper 页面点击"拍照识别"按钮，THE 小程序 SHALL 调起微信相机或相册选择界面。
2. WHEN 用户完成拍照或选图，THE OCR_Service SHALL 在 5 秒内返回识别出的文字内容。
3. IF OCR_Service 返回的文字内容为空或置信度低于阈值，THEN THE MedicationHelper SHALL 提示用户"识别失败，请重新拍摄清晰图片"并允许重试。
4. IF 网络不可用，THEN THE MedicationHelper SHALL 提示用户"当前网络不可用，请检查网络后重试"。
5. THE MedicationHelper SHALL 在识别过程中显示加载动画，防止用户重复点击。
6. WHEN OCR 识别成功，THE MedicationHelper SHALL 将识别文字传递给 LLM_Service 进行解析。

---

### 需求 3：AI 问药 — 大模型解析药品信息

**用户故事：** 作为老年用户，我希望 AI 能用简单易懂的语言解释药品的用法用量和注意事项，以便我安全用药。

#### 验收标准

1. WHEN OCR 识别文字传入，THE LLM_Service SHALL 提取药品名称、适应症、用法用量、禁忌事项四项核心信息。
2. THE LLM_Service SHALL 将解析结果以不超过 200 字的简洁中文输出，避免使用医学专业术语。
3. WHEN LLM_Service 返回解析结果，THE MedicationHelper SHALL 在页面以大字体分区展示药品名称、用法用量、注意事项。
4. IF LLM_Service 响应超过 10 秒，THEN THE MedicationHelper SHALL 提示用户"AI 解析超时，请稍后重试"。
5. IF LLM_Service 返回内容包含"处方药"标识，THEN THE MedicationHelper SHALL 额外显示"请遵医嘱，勿自行用药"警示文案。
6. THE MedicationHelper SHALL 在解析结果页面提供"重新拍照"和"语音播报"两个操作按钮。

---

### 需求 4：AI 问药 — 语音播报解析结果

**用户故事：** 作为老年用户，我希望 AI 解析结果能自动朗读出来，以便我不需要盯着屏幕阅读。

#### 验收标准

1. WHEN 用户点击"语音播报"按钮，THE TTS_Service SHALL 以 0.8 倍速朗读当前药品解析结果全文。
2. WHILE TTS_Service 正在播报，THE MedicationHelper SHALL 显示"播报中"状态并提供"停止播报"按钮。
3. WHEN 用户点击"停止播报"，THE TTS_Service SHALL 立即停止当前播报。
4. IF TTS_Service 调用失败，THEN THE MedicationHelper SHALL 提示用户"语音播报暂不可用，请阅读文字内容"。
5. THE MedicationHelper SHALL 在进入解析结果页面后自动触发一次语音播报（可在设置中关闭）。

---

### 需求 5：语音助手 — 全局悬浮麦克风

**用户故事：** 作为老年用户，我希望在小程序任意页面都能快速唤起语音助手，以便我随时用说话代替打字操作。

#### 验收标准

1. THE 小程序 SHALL 在所有页面右下角显示 FloatingMic 悬浮按钮，触摸区域不小于 88×88pt。
2. THE FloatingMic SHALL 在用户滚动页面时保持固定位置不随内容滚动。
3. WHEN 用户长按 FloatingMic 超过 0.5 秒，THE VoiceAssistant SHALL 进入录音状态并显示录音动效。
4. WHEN 用户松开 FloatingMic，THE VoiceAssistant SHALL 停止录音并将音频提交给 ASR_Service。
5. IF 用户按住时长不足 0.5 秒，THEN THE VoiceAssistant SHALL 提示用户"请长按说话"。
6. THE FloatingMic SHALL 在 MedicationHelper 的相机调用期间自动隐藏，相机关闭后恢复显示。

---

### 需求 6：语音助手 — 语音识别与大模型回答

**用户故事：** 作为老年用户，我希望说出问题后 AI 能理解并给出简洁回答，以便我用语音完成日常查询。

#### 验收标准

1. WHEN 录音结束，THE ASR_Service SHALL 在 3 秒内将语音转为文字并显示在对话界面。
2. WHEN ASR 识别完成，THE LLM_Service SHALL 根据识别文字生成回答，回答字数不超过 150 字。
3. WHEN LLM_Service 返回回答，THE TTS_Service SHALL 自动以 0.8 倍速朗读回答内容。
4. THE VoiceAssistant SHALL 在对话界面以气泡形式展示用户问题和 AI 回答，保留最近 10 条对话记录。
5. IF ASR_Service 识别结果为空或置信度过低，THEN THE VoiceAssistant SHALL 提示用户"没有听清，请再说一遍"。
6. IF LLM_Service 响应超过 8 秒，THEN THE VoiceAssistant SHALL 提示用户"AI 思考中，请稍候"并继续等待。
7. WHEN 用户说出"帮我设置提醒"类意图，THE VoiceAssistant SHALL 跳转至 HealthReminder 创建页面并预填识别到的时间和内容。

---

### 需求 7：健康提醒 — 创建提醒

**用户故事：** 作为老年用户，我希望能方便地创建用药或健康事项提醒，以便我不会忘记按时服药或做健康检查。

#### 验收标准

1. THE HealthReminder SHALL 提供创建提醒的表单，包含提醒名称、提醒时间、重复周期（单次/每天/每周/自定义）、备注四个字段。
2. THE HealthReminder SHALL 将提醒名称输入框的字体大小设置为不小于 18pt，并提供语音输入选项。
3. WHEN 用户提交创建表单，THE Reminder_Service SHALL 验证提醒时间不早于当前时间。
4. IF 提醒时间早于当前时间，THEN THE HealthReminder SHALL 提示用户"提醒时间不能早于当前时间"并阻止提交。
5. WHEN 提醒创建成功，THE Reminder_Service SHALL 将提醒数据持久化存储到本地（wx.setStorageSync）。
6. THE HealthReminder SHALL 在提醒列表页以大字体卡片形式展示所有提醒，每张卡片包含名称、下次提醒时间、启用/停用开关。

---

### 需求 8：健康提醒 — 订阅消息推送

**用户故事：** 作为老年用户，我希望到了提醒时间微信能主动通知我，以便我即使没有打开小程序也不会错过提醒。

#### 验收标准

1. WHEN 用户首次创建提醒，THE 小程序 SHALL 调起微信订阅消息授权弹窗，请求"健康提醒"消息模板的订阅权限。
2. IF 用户拒绝订阅授权，THEN THE HealthReminder SHALL 提示用户"未授权将无法收到微信通知，提醒仍会在小程序内显示"并继续保存提醒。
3. WHEN 提醒触发时间到达，THE Push_Service SHALL 通过微信订阅消息向用户发送包含提醒名称和时间的通知。
4. THE Push_Service SHALL 在提醒触发前 1 分钟完成消息下发，确保用户及时收到通知。
5. WHERE 用户已授权订阅消息，THE Push_Service SHALL 在每次重复提醒触发前重新申请一次订阅权限（微信机制限制）。

---

### 需求 9：健康提醒 — 确认反馈

**用户故事：** 作为老年用户，我希望收到提醒后能标记"已完成"，以便我和子女都能知道我按时完成了健康任务。

#### 验收标准

1. WHEN 用户点击微信通知进入小程序，THE HealthReminder SHALL 自动跳转至对应提醒的详情页。
2. THE HealthReminder 详情页 SHALL 提供"已完成"和"稍后提醒（15分钟后）"两个操作按钮，按钮触摸区域不小于 88×88pt。
3. WHEN 用户点击"已完成"，THE Reminder_Service SHALL 记录完成时间并将该次提醒标记为已完成状态。
4. WHEN 用户点击"稍后提醒"，THE Reminder_Service SHALL 在 15 分钟后重新触发该提醒一次。
5. THE HealthReminder SHALL 在提醒列表中以不同颜色区分"待完成"和"已完成"状态的提醒记录。
6. THE Reminder_Service SHALL 保留最近 30 天的提醒完成记录，供用户和子女查看。

---

### 需求 10：会员与变现体系（产品愿景）

**用户故事：** 作为产品运营方，我希望提供灵活的付费方案，以便覆盖不同消费能力的用户群体。

#### 验收标准

1. THE 小程序 SHALL 提供月卡（9.9元/月）、年卡（49元/年）、AI 问药次卡（10元/10次）三种付费方案。
2. WHEN 用户选择付费方案，THE 小程序 SHALL 调起微信支付完成扣款。
3. IF 用户未购买会员且 AI 问药免费次数已用完，THEN THE MedicationHelper SHALL 提示用户购买次卡或会员后继续使用。
4. WHERE 用户为有效会员，THE 小程序 SHALL 解锁 AI 问药不限次、语音助手不限次、健康提醒不限条等权益。
5. THE 小程序 SHALL 为新用户提供 AI 问药 3 次免费体验额度。

---

### 需求 11：完整产品愿景功能（非 MVP）

**用户故事：** 作为老年用户，我希望小程序未来能提供阅读放大镜、兴趣学堂和记忆相册功能，以便满足我更丰富的日常需求。

#### 验收标准

1. WHERE 阅读放大镜功能已上线，THE 小程序 SHALL 支持用户对任意页面文字进行 1.5x 至 3x 的局部放大查看。
2. WHERE 兴趣学堂功能已上线，THE 小程序 SHALL 提供图文和视频课程，支持字幕显示和 0.75 倍速播放。
3. WHERE 记忆相册功能已上线，THE 小程序 SHALL 支持用户上传照片并由 AI 自动生成照片故事文案。
4. WHERE 子女端功能已上线，THE 小程序 SHALL 允许子女账号查看父母的健康提醒完成记录并代为创建提醒。
