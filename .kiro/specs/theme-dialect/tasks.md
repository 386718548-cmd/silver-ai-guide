# 实现计划：UI 主题切换 + 方言朗读（讯飞 TTS）

## 概述

基于 React + TypeScript + Tailwind CSS，分步实现主题系统和方言朗读两个模块。先建立类型与数据基础，再实现 Context 状态层，然后构建 UI 组件，最后集成到应用并完成端到端串联。

## 任务

- [x] 1. 创建共享类型定义与静态配置数据
  - 新建 `src/types/theme-dialect.ts`，定义 `ThemeId`、`ThemeConfig`、`DialectId`、`DialectConfig`、`TTSStatus` 类型
  - 新建 `src/data/themes.ts`，写入四套主题的静态配置数组 `THEMES`（含 `cssVars` 映射）
  - 新建 `src/data/dialects.ts`，写入六种方言的静态配置数组 `DIALECTS`（含 `webSpeechLangs`、`xunfeiVcn`）
  - _需求：1.1, 1.2, 4.1, 4.2_

  - [ ]* 1.1 为主题配置数据编写属性测试（属性 1）
    - **属性 1：主题配置完整性**
    - **验证：需求 1.2**
    - 使用 `fc.constantFrom(...THEMES)` 验证每个主题对象字段完整性与颜色格式

  - [ ]* 1.2 为主题颜色对比度编写属性测试（属性 2）
    - **属性 2：主题颜色对比度不低于 WCAG AA 4.5:1**
    - **验证：需求 1.3**
    - 实现 `calculateContrastRatio` 工具函数，对所有主题验证 `text` vs `bg` 对比度

  - [ ]* 1.3 为方言配置数据编写属性测试（属性 7）
    - **属性 7：方言配置完整性**
    - **验证：需求 4.2**
    - 使用 `fc.constantFrom(...DIALECTS)` 验证每个方言对象字段完整性

- [x] 2. 实现 ThemeContext（主题状态管理）
  - [x] 2.1 创建 `src/contexts/ThemeContext.tsx`
    - 实现 `ThemeProvider`：初始化时从 `localStorage` 读取 `silver-ai-theme`，无效值回退 `modern-clean`
    - `setTheme` 同步更新 `document.documentElement.style` 的 CSS 变量并写入 `localStorage`
    - 在 `<html>` 标签上注入初始主题 CSS 变量，防止 FOUC
    - _需求：2.2, 2.5, 3.1, 3.2, 3.3, 3.4_

  - [ ]* 2.2 为主题切换 CSS 变量更新编写属性测试（属性 3）
    - **属性 3：主题切换后 CSS 变量正确更新**
    - **验证：需求 2.2, 2.5**
    - 使用 `fc.constantFrom(...THEME_IDS)` 验证 `setTheme` 后 `document.documentElement` 变量与配置一致

  - [ ]* 2.3 为主题持久化 round-trip 编写属性测试（属性 5）
    - **属性 5：偏好设置持久化 round-trip（主题部分）**
    - **验证：需求 3.1**
    - 验证 `setTheme(id)` 后 `localStorage.getItem('silver-ai-theme') === id`

  - [ ]* 2.4 为主题初始化读取编写属性测试（属性 6）
    - **属性 6：偏好设置初始化读取（主题部分）**
    - **验证：需求 3.2**
    - 预设 localStorage 值，验证 `ThemeContext` 初始化后 `currentTheme` 与存储值一致

- [x] 3. 实现 DialectContext（方言状态管理）
  - [x] 3.1 创建 `src/contexts/DialectContext.tsx`
    - 实现 `DialectProvider`：初始化时从 `localStorage` 读取 `silver-ai-dialect`，无效值回退 `mandarin`
    - `setDialect` 更新 Context 状态并写入 `localStorage`
    - _需求：4.3, 4.4, 4.5_

  - [ ]* 3.2 为方言持久化 round-trip 编写属性测试（属性 5）
    - **属性 5：偏好设置持久化 round-trip（方言部分）**
    - **验证：需求 4.3**
    - 验证 `setDialect(id)` 后 `localStorage.getItem('silver-ai-dialect') === id`

  - [ ]* 3.3 为方言初始化读取编写属性测试（属性 6）
    - **属性 6：偏好设置初始化读取（方言部分）**
    - **验证：需求 4.4**
    - 预设 localStorage 值，验证 `DialectContext` 初始化后 `currentDialect` 与存储值一致

- [ ] 4. 检查点 —— 确保所有测试通过
  - 确保所有测试通过，如有疑问请向用户确认。

- [x] 5. 实现讯飞 TTS 服务封装
  - [x] 5.1 创建 `src/services/xunfeiTTS.ts`
    - 实现 `XunfeiTTSEngine` 类，通过 `import.meta.env.VITE_XUNFEI_APP_ID/API_KEY/API_SECRET` 读取密钥
    - 使用 WebSocket 连接讯飞实时语音合成 API，HMAC-SHA256 动态生成鉴权 URL
    - 实现 `speak(text, dialect)` 方法：5 秒超时控制，音频流式播放
    - 实现 `stop()` 方法：立即关闭 WebSocket 并停止音频
    - API Key 未配置时直接 resolve，不抛出异常
    - _需求：6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 5.2 为 TTS 错误处理编写属性测试（属性 9）
    - **属性 9：TTS 错误处理**
    - **验证：需求 6.2, 6.3**
    - Mock WebSocket，模拟超时（>5s）和错误码，验证 `status` 变为 `'error'` 且 `statusMessage` 包含用户可读提示

- [x] 6. 实现 useDialectTTS Hook
  - [x] 6.1 创建 `src/hooks/useDialectTTS.ts`
    - 实现降级逻辑：Web Speech API → 讯飞 TTS → 普通话回退
    - Web Speech API 可用时直接朗读，`rate` 设置为 0.8
    - 讯飞 TTS 调用前设置 `status='loading'`，显示"正在连接语音服务..."
    - 朗读中设置 `status='speaking'`，`statusMessage` 包含当前方言中文名称
    - 朗读结束后 `status` 回到 `'idle'`
    - `useEffect` cleanup 中调用 `stop()` 防止内存泄漏
    - _需求：5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.4, 7.1, 7.2, 7.4, 7.5_

  - [ ]* 6.2 为 Web Speech API 降级逻辑编写属性测试（属性 8）
    - **属性 8：Web Speech API 降级触发**
    - **验证：需求 5.5, 5.6**
    - 使用 `fc.constantFrom(...DIALECTS)` + mock，验证所有 webSpeechLangs 不可用时触发讯飞 TTS 或回退普通话

  - [ ]* 6.3 为 TTS 状态正确反映编写属性测试（属性 10）
    - **属性 10：TTS 状态正确反映**
    - **验证：需求 6.4, 7.1**
    - 验证 loading → speaking → idle 状态转换，以及 statusMessage 包含方言名称

  - [ ]* 6.4 为停止朗读立即生效编写属性测试（属性 11）
    - **属性 11：停止朗读立即生效**
    - **验证：需求 7.2**
    - 使用 `fc.constantFrom('loading', 'speaking')` 验证任意状态下 `stop()` 后 `status` 立即变为 `'idle'`

  - [ ]* 6.5 为语速限制编写属性测试（属性 12）
    - **属性 12：语速不超过正常语速的 80%**
    - **验证：需求 7.5**
    - 验证所有方言使用 Web Speech API 时 `SpeechSynthesisUtterance.rate <= 0.8`

- [ ] 7. 检查点 —— 确保所有测试通过
  - 确保所有测试通过，如有疑问请向用户确认。

- [x] 8. 实现 ThemeSelector 组件
  - [x] 8.1 创建 `src/components/ThemeSelector.tsx`
    - 以卡片形式展示四套主题，每张卡片含主题名称、3 个色块预览、风格描述
    - 卡片可点击区域不低于 120×80px，调用 `setTheme` 切换主题
    - 当前选中主题卡片显示"✅ 当前主题"标记
    - _需求：2.1, 2.2, 2.3, 2.4_

  - [ ]* 8.2 为主题选中标记唯一性编写属性测试（属性 4）
    - **属性 4：主题选中标记唯一性**
    - **验证：需求 2.3**
    - 使用 `fc.constantFrom(...THEME_IDS)` 验证选中某主题后只有该卡片显示选中标记

- [x] 9. 实现 DialectTTSButton 组件
  - 创建 `src/components/DialectTTSButton.tsx`
  - 朗读按钮展示当前状态：idle 显示"🔊 朗读"，loading 显示"正在连接语音服务..."，speaking 显示"正在用 [方言名] 朗读..."，error 显示错误提示
  - 提供停止按钮，朗读中可见，点击调用 `stop()`
  - 接收 `text` prop，调用 `useDialectTTS` hook
  - _需求：7.1, 7.2, 7.3_

- [x] 10. 实现 SettingsDialog 组件
  - 创建 `src/components/SettingsDialog.tsx`
  - 使用 Radix UI Dialog，接收 `trigger` prop（⚙️ 设置按钮）
  - 内部包含"🎨 界面主题"区域（ThemeSelector）和"🗣️ 朗读方言"区域（DialectSelector）
  - 方言选择列表展示六种方言，含中文名称和括号别称，选中后调用 `setDialect`
  - 提供"返回"关闭按钮，触控区域不低于 44×44px
  - _需求：8.2, 8.3, 8.4, 8.5_

  - [ ]* 10.1 为关闭设置页面不丢失应用状态编写属性测试（属性 13）
    - **属性 13：关闭设置页面不丢失应用状态**
    - **验证：需求 8.5**
    - 使用 `fc.constantFrom(...LESSON_IDS)` 验证打开/关闭设置弹窗后 `activeId` 状态不变

- [x] 11. 集成串联：将所有模块接入 App.tsx
  - [x] 11.1 在 `src/App.tsx` 根节点包裹 `ThemeProvider` 和 `DialectProvider`
    - 在 `<html>` 初始化阶段注入主题 CSS 变量，防止 FOUC
    - _需求：3.2_

  - [x] 11.2 在页眉添加"⚙️ 设置"入口，渲染 `SettingsDialog`
    - 按钮位于页眉显眼位置，触控区域满足适老化要求
    - _需求：8.1, 8.2_

  - [x] 11.3 在课程内容区域集成 `DialectTTSButton`
    - 将当前课程文本传入 `DialectTTSButton`，切换课程时自动停止朗读
    - _需求：7.3, 7.4_

- [x] 12. 最终检查点 —— 确保所有测试通过
  - 确保所有测试通过，如有疑问请向用户确认。

## 备注

- 标有 `*` 的子任务为可选测试任务，可跳过以加快 MVP 进度
- 每个任务均标注了对应的需求条款，便于追溯
- 属性测试使用 `fast-check` 库，需先执行 `npm install --save-dev fast-check`
- 讯飞 TTS 需在项目根目录创建 `.env.local` 并配置 `VITE_XUNFEI_APP_ID`、`VITE_XUNFEI_API_KEY`、`VITE_XUNFEI_API_SECRET`
- 检查点任务确保每个阶段的增量验证
