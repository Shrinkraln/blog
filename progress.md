# 进度日志

## 会话 2026-07-08

### 14:20 — 开始
- 用户请求：优化文章页面布局
  - TOC 目录基于 h1 标题索引含子标题
  - TOC 放在文章左侧
  - 文章居中，左右留白均等
  - 文章和索引添加边框、圆角、阴影

### 14:22 — 分析完成
- 读取了 global.css、TOC.astro、[...slug].astro、BaseLayout.astro
- 了解了完整的布局结构和 TOC 生成逻辑
- 制定了 4 阶段实施计划

### 14:25 — TOC 组件修改完成
- `src/components/TOC.astro`：h2/h3 → h1/h2/h3/h4，通用化 stack 嵌套算法
- 每个 li 添加 `dataset.level` 用于层级判断

### 14:28 — CSS 布局修改完成
- `src/styles/global.css`：
  - `.article-wrapper`：grid 列交换为 `230px minmax(0, 780px)`，max-width 1080px
  - `.prose`：添加卡片样式（border, border-radius: 14px, box-shadow, padding: 36px 40px）
  - `.toc-sidebar`：添加卡片样式（border, border-radius: 14px, box-shadow, padding: 20px 18px）
  - 新增 `.toc-h1`、`.toc-h4` 链接样式
  - 暗色模式：`.prose` 和 `.toc-sidebar` 更深阴影

### 14:30 — HTML 顺序修正
- `src/pages/blog/[...slug].astro`：将 `<TOC />` 移到 `<article>` 之前
- 确保 TOC 渲染在 grid 第一列（左侧 230px）

### 14:32 — 构建验证通过
- `npm run build`：46 页面全部构建成功，无错误
- 验证生成的 HTML 结构：TOC 在左侧列，文章在右侧列
- 验证 CSS bundle 包含所有新样式规则
