// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 部署到 GitHub Pages 前，请把下面两行改成你自己的：
//   site: 'https://<你的GitHub用户名>.github.io'
//   base: '/<你的仓库名>'           ← 仓库名叫 blog 就写 '/blog'
// 如果你用的是 <用户名>.github.io 这种仓库（个人主页），base 改成 '/' 即可。
export default defineConfig({
  site: 'https://Shrinkraln.github.io',
  base: '/blog',
  integrations: [sitemap()],
});
