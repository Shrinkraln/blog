import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// 文章来源：本地 src/content/blog + 两个子模块仓库的笔记目录。
// 只收录下面这几个目录里的 .md，避免把代码区的 README 当成文章。
// 想新增来源，在这里和 src/lib/notes.ts 的 SOURCES 各加一行即可。
const notes = defineCollection({
  loader: glob({
    base: '.',
    pattern: [
      'src/content/blog/**/*.md',
      'external/ros2_learning/log/**/*.md',
      'external/python_learning/logs/**/*.md',
    ],
  }),
  // schema 全部可选：原始笔记没有 frontmatter 也能正常构建。
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { notes };
