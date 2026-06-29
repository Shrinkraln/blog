// 站点全局配置 —— 改这里就能改全站的标题、简介、作者
export const SITE_TITLE = 'Shrinkraln';
export const SITE_DESCRIPTION = '记录编程学习、踩坑与心得。';
export const AUTHOR = 'Shrinkraln';

// 把内部链接拼上 base 前缀（部署到 GitHub Pages 子路径时必须用它）
// 用法：url('/blog')、url(`/blog/${post.id}/`)
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : '/' + path}`;
}
