---
title: 你好，世界
description: 第一篇文章 —— 介绍这个博客是怎么搭起来的。
pubDate: 2026-06-29
tags: ['随笔', '开始']
---

欢迎来到我的技术博客！这是第一篇文章。

这个站点是用 [Astro](https://astro.build) 搭的，文章全部用 **Markdown** 编写，
推送到 GitHub 后自动构建并发布到 GitHub Pages，**完全免费**。

## 怎么写新文章？

1. 在 `src/content/blog/` 目录下新建一个 `.md` 文件，比如 `my-post.md`；
2. 顶部写好下面这段「frontmatter」信息；
3. 下面就用 Markdown 正文随便写。

```markdown
---
title: 文章标题
description: 一句话简介
pubDate: 2026-07-01
tags: ['标签1', '标签2']
---

正文从这里开始……
```

保存后刷新浏览器就能看到，就这么简单。下一篇见！
