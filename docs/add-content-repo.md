# 接入一个新的 md 内容仓库（部署步骤）

把一个存放 Markdown 笔记的 GitHub 仓库接进博客，作为一个新「主题」。
下面用占位符，替换成你的实际值即可。

| 占位符 | 含义 | 例子 |
|---|---|---|
| `<REPO_URL>` | 笔记仓库地址 | `https://github.com/Shrinkraln/xxx_learning.git` |
| `<NAME>` | 子模块文件夹名（一般同仓库名） | `xxx_learning` |
| `<BRANCH>` | 该仓库默认分支 | `main` 或 `master` |
| `<NOTES_DIR>` | 仓库内放 .md 的目录 | `notes`、`docs`、`log` |
| `<CATEGORY>` | 主题显示名 | `嵌入式` |
| `<SLUG>` | 网址里的英文段 | `embed` |

> 不确定默认分支？看仓库主页分支下拉框，或 `git ls-remote --symref <REPO_URL> HEAD`。

---

## 1. 把仓库挂成子模块

在博客根目录 `D:\coding_codes\blog` 执行（`-b` 会自动把分支写进 `.gitmodules`）：

```bash
git submodule add -b <BRANCH> <REPO_URL> external/<NAME>
```

挂完后 `.gitmodules` 会多出一段，确认有 `branch = <BRANCH>` 这一行。

## 2. 让加载器收录这个目录

**编辑 `src/content.config.ts`**，在 `pattern` 数组里加一行：

```ts
pattern: [
  'src/content/blog/**/*.md',
  'external/ros2_learning/log/**/*.md',
  'external/python_learning/logs/**/*.md',
  'external/<NAME>/<NOTES_DIR>/**/*.md',   // ← 新增
],
```

**编辑 `src/lib/notes.ts`**，在 `SOURCES` 数组里加一行：

```ts
export const SOURCES: Source[] = [
  { dir: 'external/ros2_learning/log', category: 'ROS2', slug: 'ros2', repoRoot: 'external/ros2_learning' },
  { dir: 'external/python_learning/logs', category: 'Python', slug: 'python', repoRoot: 'external/python_learning' },
  { dir: 'src/content/blog', category: '杂记', slug: 'misc', repoRoot: '.' },
  { dir: 'external/<NAME>/<NOTES_DIR>', category: '<CATEGORY>', slug: '<SLUG>', repoRoot: 'external/<NAME>' }, // ← 新增
];
```

> `dir` 必须与 `pattern` 里那一行的目录前缀一致；`slug` 不要和已有的重复。

## 3. 本地验证

```bash
npm run build
```

看到 `Complete!` 且无 `error` 即成功。`Duplicate id` 警告是本地增量缓存的无害提示，可忽略。

## 4. 提交并部署

```bash
git add .gitmodules external/<NAME> src/content.config.ts src/lib/notes.ts
git commit -m "接入 <NAME> 子仓库（主题：<CATEGORY>）"
git push
```

push 后博客的 GitHub Actions 会自动重建部署。

---

## 5.（可选）让该仓库「push 完秒级上线」

不做这步也行——博客每 6 小时定时兜底会自动拉取最新内容。
只有想要「在笔记仓库 push 完几秒就上线」时才需要：

1. 把 `external/<NAME>/.github/workflows/notify-blog.yml` 复制过去（内容和 ros2_learning 里那份一样），提交到 `<NAME>` 仓库。
2. 在 `<NAME>` 仓库 **Settings → Secrets and variables → Actions** 新建 secret：
   - Name：`BLOG_DISPATCH_TOKEN`
   - Secret：那串 fine-grained PAT（scope：blog 仓库 Contents 读写）。**同一串令牌可复用到所有仓库**。

---

## 写笔记的注意事项

- **可以不写 frontmatter**：系统自动用第一个 `#` 标题当标题、git 提交时间当日期。
- **要写 frontmatter 就别写错**——冒号后必须有空格 `键: 值`，否则整个博客构建会失败：

  ```markdown
  ---
  title: 文章标题
  description: 一句话简介
  pubDate: 2026-06-29
  tags: ['标签']
  ---
  ```

- **同主题分系列**：在 `<NOTES_DIR>` 下建子文件夹，文件名用 `01- 02-` 前缀控制顺序，
  博客会自动把同一文件夹的多篇 md 聚合成一个系列（带上一篇/下一篇）。
