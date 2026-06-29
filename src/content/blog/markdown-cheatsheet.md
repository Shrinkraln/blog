---
title: Markdown 速查：写技术笔记够用了
description: 常用的 Markdown 语法整理，写博客时随手翻一下。
pubDate: 2026-06-28
tags: ['Markdown', '教程']
---

写技术笔记，掌握下面这些 Markdown 语法基本就够用了。

## 标题与强调

用 `#` 表示标题，数量代表层级。强调用 `**加粗**` 和 `*斜体*`。

## 代码

行内代码用反引号包起来，比如 `npm run dev`。代码块用三个反引号，并标注语言：

```js
function greet(name) {
  return `你好, ${name}!`;
}
console.log(greet('世界'));
```

## 列表

无序列表：

- 苹果
- 香蕉

有序列表：

1. 第一步
2. 第二步

## 引用与链接

> 这是一段引用，常用来强调重点。

链接写法：`[显示文字](https://example.com)`。

## 表格

| 命令            | 作用         |
| --------------- | ------------ |
| `npm run dev`   | 本地预览     |
| `npm run build` | 打包构建     |

掌握这些，就能舒服地写笔记了。
