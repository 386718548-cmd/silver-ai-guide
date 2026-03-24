# 🚀 部署指南 | Deployment Guide

本指南将帮您将"银发 AI 指南"项目部署到 GitHub Pages，让任何人都能通过链接访问。

## 📋 前置条件

✅ 已安装 Git  
✅ 有 GitHub 账号  
✅ 项目已推送到 GitHub 仓库  

---

## 🎯 部署步骤

### 第 1 步：确认项目配置

确保以下文件已正确配置：

**vite.config.ts** - 包含 base 配置：
```typescript
export default defineConfig({
  base: "/silver-ai-guide/",  // 改成你的仓库名
  // ... 其他配置
});
```

**package.json** - 包含 deploy 命令：
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 第 2 步：本地测试

在部署前，试试本地构建是否正常：

```bash
npm run build
```

如果看到 `✓ built in ...`，说明没问题。

### 第 3 步：执行部署

运行以下命令进行部署（第一次需要输入 GitHub 密钥）：

```bash
npm run deploy
```

#### 第一次部署时的认证

如果提示需要认证，有两种方式：

**方式 A：使用个人访问令牌 (推荐)**

1. 打开 https://github.com/settings/tokens
2. 点击 "Generate new token"
3. 勾选 `repo` 权限
4. 生成并复制令牌
5. 粘贴到终端

**方式 B：使用 SSH**

如果已配置 SSH，可自动认证（无需输入密码）。

### 第 4 步：验证部署

部署成功后，您会看到类似的输出：
```
Published
```

然后访问网址查看效果：
```
https://YOUR_USERNAME.github.io/silver-ai-guide/
```

---

## 🌐 分享给长辈

部署完成后，可以通过以下方式分享：

### 方式 1：直接分享链接
```
https://YOUR_USERNAME.github.io/silver-ai-guide/
```

### 方式 2：生成二维码
在浏览器中访问上述链接，然后：
- iOS/iPad：点击分享 → 添加到主屏幕
- 安卓：点击菜单 → 添加到主屏幕

### 方式 3：通过微信分享
将链接粘贴到微信，长辈可直接打开。

---

## 🔄 后续更新

如果您修改了代码或内容，想要更新已部署的版本，只需：

```bash
# 修改代码后...
git add .
git commit -m "更新课程内容"
git push

# 然后重新部署
npm run deploy
```

新版本会自动替换旧版本。

---

## ⚙️ 配置 GitHub Pages（仅需一次）

如果上面的步骤没有自动生成网站，可以手动配置：

1. 打开 GitHub 仓库 → **Settings**
2. 左侧菜单找到 **Pages**
3. 在 **Source** 下拉框选择 **gh-pages** 分支
4. 点击 **Save**
5. 等待几分钟，页面会显示网站 URL

---

## 🐛 常见问题

**Q: 部署后样式丢失？**
A: 检查 `vite.config.ts` 中的 base 配置是否正确。

**Q: 部署后报 404？**
A: 确保 GitHub 仓库名和 `vite.config.ts` 中的 base 一致。

**Q: 如何撤回部署？**
A: GitHub Pages 的每个部署都有历史记录。在仓库的 Deployments 页面可以查看。

**Q: 需要自己的域名吗？**
A: 不需要！GitHub Pages 免费提供 github.io 域名。

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看 GitHub Pages 官方文档：https://pages.github.com/
2. 查看 gh-pages 文档：https://github.com/tschaub/gh-pages
3. 提交 GitHub Issue

---

**🎉 部署完成后，您就可以将链接分享给全世界的长辈了！**
