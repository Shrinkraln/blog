# 研究发现

## 当前博客架构
- **框架**: Astro (SSG)
- **CSS**: 单文件 `src/styles/global.css`，使用 CSS 自定义属性（变量）
- **布局**: `BaseLayout.astro` 提供外层 HTML 骨架
- **文章页**: `[...slug].astro` 使用 `.article-wrapper` grid 布局
  - 当前：`grid-template-columns: 1fr 210px` — TOC 在右侧
  - 文章：`<article class="prose">` 占据主列
  - TOC：`<TOC />` 组件在第二列

## TOC 组件详情
- 位置：`src/components/TOC.astro`
- 当前只捕获 `h2, h3` 标题
- 使用 `IntersectionObserver` 高亮当前可见标题
- 少于 2 个标题时自动隐藏
- h3 嵌套在 h2 的 `<ul class="toc-sub">` 中

## CSS 关键变量
```css
--bg: #ffffff / #0d1117 (dark)
--fg: #1f2328 / #e6edf3 (dark)
--border: #e4e7eb / #21262d (dark)
--muted: #656d76 / #9198a1 (dark)
--accent: #2f6feb / #6ea8ff (dark)
--code-bg: #f6f8fa / #161b22 (dark)
--max-width: 720px
```

## 需要修改的样式规则
1. `.article-wrapper` — grid 列顺序、宽度
2. `.prose` — 卡片化（border, border-radius, box-shadow, padding, bg）
3. `.toc-sidebar` — 卡片化 + 标题层级样式扩展
4. 暗色模式下的 box-shadow
