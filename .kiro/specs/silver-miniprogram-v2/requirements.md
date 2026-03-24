# 需求文档

## 简介

银龄 AI 助手小程序 v2 是在现有 uni-app + Vue3 + TypeScript 微信小程序基础上扩展的四项新功能：**方言识别**、**UI 主题切换**、**AI 情感陪伴聊天**、**紧急救助系统**。

现有小程序已具备 AI 问药、语音助手、健康提醒三大核心功能。本次扩展聚焦于提升老年用户的语言包容性、视觉舒适度、情感陪伴体验，以及紧急安全保障能力。

目标用户：
- 不懂普通话的老年人（粤语、闽南语、四川话等方言用户）
- 有个性化视觉偏好的老年用户
- 需要情感陪伴的独居或空巢老人
- 有紧急求助需求的高龄老人及其子女

---

## 词汇表

- **小程序**：基于微信平台运行的 uni-app + Vue3 应用
- **Dialect_ASR_Service**：方言语音识别服务，基于讯飞 ASR 或微信同声传译插件，支持粤语、闽南语、四川话等方言转文字
- **Theme_Service**：UI 主题管理服务，负责主题的存储、切换与全局应用
- **Companion_LLM_Service**：情感陪伴大模型服务，基于通义千问，配置情感陪伴人格，负责生成关怀性对话回复
- **SOS_Service**：紧急救助服务，负责触发 SOS 流程、获取位置、通知紧急联系人
- **Contact_Service**：紧急联系人管理服务，负责联系人的增删改查与本地持久化
- **TTS_Service**：讯飞语音合成服务，负责将文字转为语音播报
- **ASR_Service**：现有普通话语音识别服务
- **VoiceAssistant**：现有语音助手功能模块
- **DialectRecognizer**：方言识别功能模块
- **ThemeSelector**：主题选择功能模块
- **CompanionChat**：AI 情感陪伴聊天功能模块
- **SOSPanel**：紧急救助面板组件
- **用户**：使用本小程序的老年人
- **紧急联系人**：用户预先设置的子女或家属联系人

---

## 需求

### 需求 1：方言识别 — 方言语音输入支持

**用户故事：** 作为不懂普通话的老年用户，我希望用粤语、闽南语或四川话说话也能被识别，以便我不因语言障碍而无法使用小程序。

#### 验收标准

1. THE 小程序 SHALL 在语音输入入口提供方言选择选项，支持普通话、粤语、闽南语、四川话四种语言模式。
2. WHEN 用户选择方言模式并开始录音，THE Dialect_ASR_Service SHALL 使用对应方言的识别引擎处理音频。
3. WHEN 方言录音结束，THE Dialect_ASR_Service SHALL 在 5 秒内返回识别出的普通话文字转写结果。
4. THE DialectRecognizer SHALL 在语音输入界面以大字体（不小于 32rpx）显示当前选中的语言模式名称。
5. WHEN 用户切换语言模式，THE DialectRecognizer SHALL 保存用户的语言偏好设置到本地存储，下次启动时自动恢复。
6. IF Dialect_ASR_Service 识别置信度低于 0.5，THEN THE DialectRecognizer SHALL 提示用户"没有听清，请再说一遍"并允许重试。
7. IF Dialect_ASR_Service 调用失败或超时（超过 8 秒），THEN THE DialectRecognizer SHALL 提示用户"方言识别暂不可用，已切换为普通话识别"并自动降级到 ASR_Service。
8. WHERE 微信同声传译插件已启用，THE Dialect_ASR_Service SHALL 优先使用微信同声传译插件进行方言识别。
9. WHERE 讯飞 ASR 已配置，THE Dialect_ASR_Service SHALL 在微信同声传译插件不可用时使用讯飞 ASR 作为备选。

---

### 需求 2：方言识别 — 与现有语音助手集成

**用户故事：** 作为方言用户，我希望方言识别能无缝融入现有语音助手流程，以便我不需要额外学习新的操作方式。

#### 验收标准

1. THE VoiceAssistant SHALL 在录音界面显示当前语言模式，并提供切换入口。
2. WHEN 用户在 VoiceAssistant 中切换语言模式，THE DialectRecognizer SHALL 在不退出当前页面的情况下完成切换。
3. THE DialectRecognizer SHALL 将方言识别结果转写为普通话文字后，交由现有 LLM_Service 处理，保持后续流程不变。
4. THE 小程序 SHALL 在 FloatingMic 悬浮按钮长按录音时，使用用户当前选中的语言模式进行识别。
5. IF 方言识别返回的普通话转写文字为空，THEN THE VoiceAssistant SHALL 提示用户"没有听清，请再说一遍"。

---

### 需求 3：UI 主题切换 — 主题选择与应用

**用户故事：** 作为老年用户，我希望能在小程序内选择符合自己审美偏好的视觉主题，以便获得更舒适的使用体验。

#### 验收标准

1. THE 小程序 SHALL 提供四种视觉主题：自然草本风、中华传统风、现代简约风、水墨养生风。
2. THE ThemeSelector SHALL 在设置页面以预览卡片形式展示四种主题，每张卡片包含主题名称和配色预览。
3. WHEN 用户选择一种主题，THE Theme_Service SHALL 在 500 毫秒内将主题应用到所有当前可见页面。
4. WHEN 用户选择主题，THE Theme_Service SHALL 将选中的主题标识持久化存储到本地（wx.setStorageSync）。
5. WHEN 小程序启动，THE Theme_Service SHALL 读取本地存储的主题设置并在首页渲染前完成主题应用，避免主题闪烁。
6. THE Theme_Service SHALL 为每种主题定义主色调、背景色、文字色、卡片色、强调色五个核心色彩变量。
7. IF 本地存储中无主题设置，THEN THE Theme_Service SHALL 默认应用"水墨养生风"主题。

---

### 需求 4：UI 主题切换 — 主题色彩规范

**用户故事：** 作为老年用户，我希望每种主题都有清晰的视觉区分度，以便我能根据喜好轻松辨别和选择。

#### 验收标准

1. THE Theme_Service SHALL 为"自然草本风"主题定义主色调为 #4CAF50（草绿色），背景色为 #F1F8E9，强调色为 #8BC34A。
2. THE Theme_Service SHALL 为"中华传统风"主题定义主色调为 #C0392B（朱砂红），背景色为 #F7F3EB，强调色为 #E74C3C。
3. THE Theme_Service SHALL 为"现代简约风"主题定义主色调为 #2196F3（科技蓝），背景色为 #FAFAFA，强调色为 #03A9F4。
4. THE Theme_Service SHALL 为"水墨养生风"主题定义主色调为 #5D4037（深棕色），背景色为 #EFEBE9，强调色为 #795548。
5. THE Theme_Service SHALL 确保所有主题的文字与背景色对比度不低于 4.5:1，符合无障碍可读性要求。
6. THE 小程序 SHALL 通过 CSS 变量（--theme-primary、--theme-bg、--theme-text、--theme-card、--theme-accent）在全局应用主题色彩。

---

### 需求 5：AI 情感陪伴聊天 — 对话功能

**用户故事：** 作为独居老年用户，我希望能与 AI 进行轻松的日常聊天，以便在子女不在身边时获得情感陪伴和关怀。

#### 验收标准

1. THE 小程序 SHALL 在主页功能卡片中新增"AI 陪伴"入口，图标为 💬，描述文案为"聊聊天，说说心里话"。
2. THE CompanionChat SHALL 提供独立的聊天页面，以气泡形式展示对话记录，用户消息靠右，AI 消息靠左。
3. WHEN 用户发送文字消息，THE Companion_LLM_Service SHALL 在 10 秒内返回回复，回复字数不超过 200 字。
4. WHEN 用户发送语音消息，THE DialectRecognizer SHALL 先将语音转为文字，再由 Companion_LLM_Service 生成回复。
5. THE Companion_LLM_Service SHALL 以关怀、温暖、耐心的语气回复，避免使用生硬的功能性语言，主动询问用户的日常状态。
6. THE CompanionChat SHALL 在每次对话开始时，由 AI 主动发送一条问候语，内容根据当前时间段（早晨/下午/晚上）动态生成。
7. THE CompanionChat SHALL 保留最近 50 条对话记录，持久化存储到本地。
8. WHEN Companion_LLM_Service 返回回复，THE TTS_Service SHALL 自动以 0.8 倍速朗读回复内容（可在设置中关闭）。
9. IF Companion_LLM_Service 响应超过 10 秒，THEN THE CompanionChat SHALL 显示"AI 正在思考中..."提示并继续等待。
10. IF Companion_LLM_Service 调用失败，THEN THE CompanionChat SHALL 提示用户"网络不稳定，请稍后再试"。

---

### 需求 6：AI 情感陪伴聊天 — 人格与话题引导

**用户故事：** 作为老年用户，我希望 AI 能主动关心我的生活，而不只是被动回答问题，以便感受到真实的陪伴感。

#### 验收标准

1. THE Companion_LLM_Service SHALL 使用固定的系统提示词，将 AI 人格设定为"银龄"——一位耐心、温暖、懂得倾听的老年关怀助手。
2. THE CompanionChat SHALL 在聊天界面提供话题引导快捷按钮，包含"聊聊今天"、"讲个故事"、"健康小知识"、"想念家人"四个选项。
3. WHEN 用户点击话题引导按钮，THE CompanionChat SHALL 将对应话题作为用户消息发送并触发 AI 回复。
4. THE Companion_LLM_Service SHALL 在对话中识别用户表达的负面情绪（如孤独、难过、身体不适），并在回复中给予情感支持，同时建议联系家人或就医。
5. WHEN Companion_LLM_Service 检测到用户描述身体严重不适，THE CompanionChat SHALL 在回复下方显示"需要帮助？一键联系家人"的快捷入口，点击后跳转至 SOSPanel。
6. THE CompanionChat SHALL 记录用户的聊天偏好（如常聊话题），并在下次对话开始时由 AI 主动提及，增强连续性体验。

---

### 需求 7：紧急救助系统 — SOS 触发与倒计时

**用户故事：** 作为高龄老年用户，我希望在紧急情况下能一键发出求救信号，以便子女能及时知道我需要帮助。

#### 验收标准

1. THE 小程序 SHALL 在主页右上角提供常驻 SOS 快捷入口，触摸区域不小于 88×88pt，以红色背景显著标识。
2. THE 小程序 SHALL 在主页功能卡片中新增"紧急救助"入口，图标为 🆘，描述文案为"一键求救，守护安全"。
3. WHEN 用户点击 SOS 入口，THE SOSPanel SHALL 显示包含 10 秒倒计时的确认界面，防止误触发。
4. WHILE 倒计时进行中，THE SOSPanel SHALL 以大字体（不小于 80rpx）显示剩余秒数，并提供"取消"按钮。
5. WHEN 倒计时结束且用户未取消，THE SOS_Service SHALL 触发完整的紧急救助流程。
6. WHEN 用户在倒计时期间点击"取消"，THE SOSPanel SHALL 立即终止倒计时并关闭确认界面，不发送任何通知。
7. THE SOSPanel SHALL 在倒计时期间持续震动提示（每秒一次），提醒用户确认操作。

---

### 需求 8：紧急救助系统 — 位置获取与通知发送

**用户故事：** 作为老年用户的子女，我希望收到 SOS 通知时能同时看到父母的位置信息，以便快速赶到或安排救援。

#### 验收标准

1. WHEN SOS 流程触发，THE SOS_Service SHALL 调用微信 wx.getLocation 接口获取用户当前 GPS 坐标。
2. WHEN 位置获取成功，THE SOS_Service SHALL 将位置坐标转换为可读地址（省市区街道），并附加在通知内容中。
3. THE SOS_Service SHALL 向所有已设置的紧急联系人发送包含以下信息的通知：用户姓名、当前时间、位置地址、位置坐标链接。
4. THE SOS_Service SHALL 在 30 秒内完成位置获取和通知发送的完整流程。
5. IF wx.getLocation 调用失败或用户拒绝位置权限，THEN THE SOS_Service SHALL 在通知中注明"位置获取失败"并继续发送其他信息。
6. IF 紧急联系人列表为空，THEN THE SOS_Service SHALL 提示用户"尚未设置紧急联系人，请先前往设置页面添加"并跳转至联系人设置页面。
7. WHEN 通知发送成功，THE SOSPanel SHALL 显示"已通知家人，请保持冷静"的确认信息，并显示已通知的联系人列表。
8. IF 通知发送失败（网络异常），THEN THE SOS_Service SHALL 提示用户"通知发送失败，请拨打 120 或直接联系家人"，并显示紧急联系人的电话号码。

---

### 需求 9：紧急救助系统 — 紧急联系人管理

**用户故事：** 作为老年用户，我希望能方便地添加和管理紧急联系人，以便在紧急情况下能通知到正确的家人。

#### 验收标准

1. THE Contact_Service SHALL 支持最多 5 位紧急联系人的存储，每位联系人包含姓名、手机号码、与用户关系（如"儿子"、"女儿"）三个字段。
2. THE 小程序 SHALL 在设置页面提供紧急联系人管理入口，支持添加、编辑、删除操作。
3. WHEN 用户添加联系人，THE Contact_Service SHALL 验证手机号码格式为 11 位数字且以 1 开头。
4. IF 手机号码格式不正确，THEN THE Contact_Service SHALL 提示用户"请输入正确的手机号码"并阻止保存。
5. WHEN 联系人保存成功，THE Contact_Service SHALL 将联系人数据持久化存储到本地（wx.setStorageSync）。
6. THE 小程序 SHALL 在首次启动时引导用户设置至少一位紧急联系人，并说明其用途。
7. THE Contact_Service SHALL 支持从微信通讯录选择联系人，自动填充姓名和手机号码字段。

---

### 需求 10：紧急救助系统 — SOS 历史记录

**用户故事：** 作为老年用户的子女，我希望能查看父母的 SOS 触发历史，以便了解父母的安全状况。

#### 验收标准

1. THE SOS_Service SHALL 记录每次 SOS 触发的时间、位置、通知状态，并持久化存储到本地。
2. THE 小程序 SHALL 在紧急救助页面提供 SOS 历史记录查看入口，以时间倒序展示最近 20 条记录。
3. THE SOS_Service SHALL 保留最近 90 天的 SOS 历史记录，超出时间范围的记录自动清除。
4. WHEN 用户查看 SOS 历史记录，THE 小程序 SHALL 以大字体卡片形式展示每条记录的触发时间和位置信息。
5. THE SOS_Service SHALL 区分"已成功通知"和"通知失败"两种状态，并在历史记录中以不同颜色标识。

