import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// 博客文章集合：所有 src/content/blog 下的 .md 文件
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
