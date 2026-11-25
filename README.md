# Awei Blog

基于 Hexo 7 和 Butterfly 主题的静态博客。

- 在线博客：[https://awei-7.github.io](https://awei-7.github.io)
- GitHub 仓库：[https://github.com/Awei-7/Awei-7.github.io](https://github.com/Awei-7/Awei-7.github.io)
- `main` 分支：GitHub Pages 发布的静态文件
- `source` 分支：可编辑的 Hexo 博客源码

## 环境要求

- Node.js 20 或更高版本（推荐使用 `.nvmrc` 中的版本）
- npm
- Git

## 本地启动

```powershell
git clone -b source https://github.com/Awei-7/Awei-7.github.io.git
cd Awei-7.github.io
npm ci
npm run server
```

本地预览地址：`http://localhost:4000`

## 写作

使用 Hexo 创建新文章：

```powershell
npx hexo new "文章标题"
```

文章位于 `source/_posts/`。每篇文章建议包含稳定的 Front Matter，避免换电脑或执行 `hexo clean` 后日期和 URL 发生变化：

```yaml
---
title: 文章标题
description: 文章摘要
date: 2024-04-09 12:26:44
updated: 2026-09-02 15:28:52
slug: stable-url-segment
categories:
  - 分类
tags:
  - 标签
top_image: /image/HeadPic/example.jpg
cover: /image/HeadPic/example.jpg
---
```

图片推荐放在 `source/image/` 下，并使用 `/image/...` 根路径引用。

## 构建与检查

```powershell
npm run clean
npm run build
npm run check:assets
```

静态文件输出到 `public/`。

## 发布到 GitHub Pages

```powershell
npm run deploy
```

发布脚本会先清理缓存、重新构建，再通过 `hexo-deployer-git` 推送到
`https://github.com/Awei-7/Awei-7.github.io.git` 的 `main` 分支。GitHub Pages 会从
`main` 分支根目录发布，更新完成后访问：

`https://awei-7.github.io`

如果 GitHub Pages 尚未开启，请在仓库的 `Settings -> Pages` 中选择
`Deploy from a branch`，分支选择 `main`，目录选择 `/(root)`。

## GitHub Actions

将源码推送到 `source` 分支后，GitHub Actions 会自动执行构建和资源检查：

```powershell
git add .
git commit -m "Update blog"
git push origin source
```

本地写作预览后，再运行 `npm run deploy` 更新线上博客。
