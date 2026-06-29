import rss from '@astrojs/rss';
import { getNotes } from '../lib/notes';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  const notes = await getNotes();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: notes
      .sort((a, b) => (b.date?.valueOf() ?? 0) - (a.date?.valueOf() ?? 0))
      .map((n) => ({
        title: n.title,
        description: n.description ?? `${n.category}${n.series ? ' · ' + n.series : ''}`,
        pubDate: n.date ?? new Date(),
        link: `/blog/${n.slug}/`,
      })),
  });
}
