# 🌟 银发 AI 指南 | Silver AI Guide

> 🎁 专为中老年朋友设计，让每一位长者都能轻松、安全地享受人工智能带来的便利。

![版本](https://img.shields.io/badge/%E7%89%88%E6%9C%AC-1.0.0-blue)
![适合人群](https://img.shields.io/badge/%E9%80%82%E5%90%88-55%E5%B2%81%2B%E9%95%BF%E8%BE%88-green)
![许可](https://img.shields.io/badge/%E8%AE%B8%E5%8F%AF-MIT-brightgreen)

## 📖 项目简介

“银发 AI 指南”是一个面向长辈的 **零门槛 AI 教程**：用更大的字、更清晰的对比度、更生活化的语言，把 AI 讲明白、教会用、提醒防诈骗。

## 🚀 在线访问（推荐长辈）

打开链接即可使用（无需安装）：

- `https://386718548-cmd.github.io/silver-ai-guide/`

## 🧑‍💻 本地运行（开发者）

```bash
npm install
npm run dev
```

默认访问：

- `http://localhost:8080/silver-ai-guide/`

## 🎨 适老化设计要点

- **大字体**：基础字号提升到 20px，标题更大
- **高对比度**：纯白背景 + 深色文字，减少低对比配色
- **大按钮**：更大的点击/触控区域，减少误触

## 📚 核心课程（前三课草稿）

课程内容在 `src/data/lessons.ts` 统一维护，支持 HTML/Markdown 文本。

- 第 1 课：什么是 AI？
- 第 2 课：您的第一个 AI 助手
- 第 3 课：微信里的 AI 功能

## 🚀 部署上线（GitHub Pages）

本项目已配置 `gh-pages` 一键部署：

```bash
npm run deploy
```

部署成功后，GitHub Pages 一般会是：

- `https://<YOUR_USERNAME>.github.io/silver-ai-guide/`

详细步骤见 `DEPLOYMENT_GUIDE.md`。

## 📅 后续迭代计划

详见 `ROADMAP.md`，包含：

- Phase 2：🔊 语音朗读（Web Speech API）
- Phase 3：🖨️ 一键打印版（PDF/打印样式）
- Phase 4：📹 视频嵌入
- Phase 5：👨‍👩‍👧 子女模式
