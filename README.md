# 我的技术博客

用 [Astro](https://astro.build) 搭建的静态博客，Markdown 写文章，部署在 GitHub Pages，免费。

## 本地预览

```bash
npm install      # 第一次先装依赖
npm run dev      # 启动本地开发服务器
```

打开终端里给出的地址（通常是 http://localhost:4321/blog/）即可看到。

## 写新文章

在 `src/content/blog/` 下新建一个 `.md` 文件，顶部加上：

```markdown
---
title: 文章标题
description: 一句话简介
pubDate: 2026-07-01
tags: ['标签']
---

正文……
```

保存即可，开发服务器会自动刷新。

## 改成你自己的

- `src/consts.ts` —— 站点标题、简介、作者
- `src/pages/about.astro` —— 关于页
- `astro.config.mjs` —— 部署前把 `site` 和 `base` 改成你的 GitHub 信息

## 部署到 GitHub Pages（免费）

1. 在 GitHub 新建一个仓库，比如叫 `blog`。
2. 修改 `astro.config.mjs`：
   - `site: 'https://<你的用户名>.github.io'`
   - `base: '/blog'`（仓库名是什么就写什么；个人主页仓库写 `'/'`）
3. 把代码推上去：

   ```bash
   git init
   git add .
   git commit -m "init blog"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/blog.git
   git push -u origin main
   ```

4. 打开仓库 **Settings → Pages**，把 **Source** 设为 **GitHub Actions**。
5. 等 Actions 跑完，访问 `https://<你的用户名>.github.io/blog/` 即可。

之后每次 `git push`，网站都会自动更新。
