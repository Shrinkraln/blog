# 任务计划：文章页面布局优化

## 目标
优化博客文章页面的布局：TOC 目录基于 h1~h4 标题层级、移到文章左侧、文章居中、左右留白均等、添加卡片化样式（边框+圆角+阴影）。

## 阶段

### 阶段 1：分析当前布局 ✅
- [x] 读取 global.css — 已分析 `.article-wrapper`、`.prose`、`.toc-sidebar`
- [x] 读取 TOC.astro — 当前只捕获 h2/h3，TOC 在右侧
- [x] 读取 [...slug].astro — TOC 在 article 之后的 grid 列中

### 阶段 2：修改 TOC 组件 ✅
- [x] 扩展标题捕获范围：h2/h3 → h1/h2/h3/h4
- [x] 改进嵌套逻辑：通用化 stack 算法支持任意层级
- [x] 新增 CSS 类 `.toc-h1`、`.toc-h4`

### 阶段 3：修改 CSS 布局 ✅
- [x] 交换 grid 列顺序：`230px minmax(0, 780px)`（TOC 左侧）
- [x] 给 `.prose` 添加卡片样式：border + border-radius:14px + box-shadow + padding
- [x] 给 `.toc-sidebar` 添加卡片样式：border + border-radius:14px + box-shadow + padding
- [x] 调整整体宽度和间距确保左右留白均等
- [x] 暗色模式适配阴影
- [x] 交换 HTML 中 TOC 与 article 的顺序

### 阶段 4：构建验证 ✅
- [x] `npm run build` 确认无编译错误（46 页面全部通过）
- [x] 验证 TOC 在 HTML 中位于 article 之前（左侧列）
- [x] 验证 CSS bundle 包含所有新样式

## 涉及文件
| 文件 | 操作 |
|------|------|
| `src/components/TOC.astro` | 修改 |
| `src/styles/global.css` | 修改 |

## 遇到的错误
| 错误 | 尝试次数 | 解决方案 |
|------|---------|---------|
