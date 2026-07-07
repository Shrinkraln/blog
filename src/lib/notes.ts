import { getCollection, type CollectionEntry } from 'astro:content';
import { execFileSync } from 'node:child_process';

// ───────────────────────────────────────────────────────────────────
// 文章来源配置
//   dir      : 笔记目录（相对项目根，也是 entry.id 的前缀）
//   category : 主题显示名（首页/目录页按主题分组）
//   slug     : 主题在网址里的英文段，如 /blog/ros2/...
//   repoRoot : 该来源所在的 git 仓库根（用于读取「最后更新」时间）
// 新增一个来源 = 这里加一行 + content.config.ts 的 pattern 加一行
// ───────────────────────────────────────────────────────────────────
export interface Source {
  dir: string;
  category: string;
  slug: string;
  subCategory?: string; // 若设置，散篇文章会归入此命名的虚拟系列（如 STM32F103C8T6）
  repoRoot: string;
}

export const SOURCES: Source[] = [
  { dir: 'external/ros2_learning/log', category: 'ROS2', slug: 'ros2', repoRoot: 'external/ros2_learning' },
  { dir: 'external/python_learning/logs', category: 'Python', slug: 'python', repoRoot: 'external/python_learning' },
  { dir: 'src/content/blog/stm32f103c8t6', category: 'STM32', slug: 'stm32', subCategory: 'STM32F103C8T6', repoRoot: '.' },
  { dir: 'src/content/blog/misc', category: '杂记', slug: 'misc', repoRoot: '.' },
];

export interface Note {
  entry: CollectionEntry<'notes'>;
  category: string;
  categorySlug: string;
  series: string | null; // 所属系列（= 笔记目录下的子文件夹名），无则为 null
  title: string;
  description?: string;
  tags: string[];
  date: Date | null;
  slug: string; // 网址中 /blog/ 之后的部分
  order: string; // 系列内排序键（文件名）
}

// ── 取「最后更新」时间：优先 frontmatter.pubDate，否则取该文件最后一次 git 提交时间 ──
const dateCache = new Map<string, Date | null>();
function gitDate(repoRoot: string, relPath: string): Date | null {
  const key = `${repoRoot}:${relPath}`;
  if (dateCache.has(key)) return dateCache.get(key)!;
  let d: Date | null = null;
  try {
    const out = execFileSync(
      'git',
      ['-C', repoRoot, 'log', '-1', '--format=%cI', '--', relPath],
      { encoding: 'utf8' }
    ).trim();
    if (out) d = new Date(out);
  } catch {
    /* 没有 git 或文件未提交时静默忽略 */
  }
  dateCache.set(key, d);
  return d;
}

// ── 没有 frontmatter.title 时，从正文第一个 # 标题取，再不行用文件名 ──
function deriveTitle(entry: CollectionEntry<'notes'>, basename: string): string {
  if (entry.data.title) return entry.data.title;
  const body = (entry as { body?: string }).body;
  const m = body?.match(/^\s{0,3}#\s+(.+?)\s*#*\s*$/m);
  if (m) return m[1].trim();
  return basename;
}

let cache: Note[] | null = null;

export async function getNotes(): Promise<Note[]> {
  if (cache) return cache;
  const entries = await getCollection('notes');
  const notes: Note[] = [];

  for (const entry of entries) {
    const src = SOURCES.find((s) => entry.id.startsWith(s.dir + '/'));
    if (!src) continue;

    const remainder = entry.id.slice(src.dir.length + 1); // 笔记目录之后的路径
    const parts = remainder.split('/');
    const basename = parts[parts.length - 1];
    const series = parts.length > 1 ? parts[0] : null;

    const fullRel = `${entry.id}.md`;
    const relPath =
      src.repoRoot === '.' ? fullRel : fullRel.slice(src.repoRoot.length + 1);
    const date = entry.data.pubDate ?? gitDate(src.repoRoot, relPath);

    notes.push({
      entry,
      category: src.category,
      categorySlug: src.slug,
      series,
      title: deriveTitle(entry, basename),
      description: entry.data.description,
      tags: entry.data.tags,
      date,
      slug: `${src.slug}/${remainder}`,
      order: basename,
    });
  }

  cache = notes;
  return notes;
}

// ── 同系列的所有篇目（按文件名排序），用于「上一篇/下一篇」 ──
export async function getSeriesSiblings(note: Note): Promise<Note[]> {
  if (!note.series) return [];
  const all = await getNotes();
  return all
    .filter((n) => n.category === note.category && n.series === note.series)
    .sort((a, b) => a.order.localeCompare(b.order, 'zh'));
}

// ── 按「主题 → 系列 / 散篇」分组，给目录页和首页用 ──
export interface SeriesGroup {
  name: string;
  notes: Note[];
}
export interface CategoryGroup {
  category: string;
  slug: string;
  series: SeriesGroup[];
  loose: Note[];
}

export async function getGrouped(): Promise<CategoryGroup[]> {
  const all = await getNotes();
  return SOURCES.map((src) => {
    const inCat = all.filter((n) => n.category === src.category);
    const seriesMap = new Map<string, Note[]>();
    const loose: Note[] = [];
    for (const n of inCat) {
      if (n.series) {
        const arr = seriesMap.get(n.series) ?? [];
        arr.push(n);
        seriesMap.set(n.series, arr);
      } else if (src.subCategory) {
        // 散篇文章归入虚拟系列（子栏目）
        const arr = seriesMap.get(src.subCategory) ?? [];
        arr.push(n);
        seriesMap.set(src.subCategory, arr);
      } else {
        loose.push(n);
      }
    }
    const series: SeriesGroup[] = [...seriesMap.entries()]
      .map(([name, notes]) => ({
        name,
        notes: notes.sort((a, b) => a.order.localeCompare(b.order, 'zh')),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    loose.sort(byDateThenTitle);
    return { category: src.category, slug: src.slug, series, loose };
  }).filter((c) => c.series.length > 0 || c.loose.length > 0);
}

// ── 最近更新：有日期的按日期倒序，取前 N 篇 ──
export async function getRecent(limit = 6): Promise<Note[]> {
  const all = await getNotes();
  return [...all].sort(byDateThenTitle).slice(0, limit);
}

function byDateThenTitle(a: Note, b: Note): number {
  const da = a.date?.valueOf() ?? 0;
  const db = b.date?.valueOf() ?? 0;
  if (db !== da) return db - da;
  return a.title.localeCompare(b.title, 'zh');
}
