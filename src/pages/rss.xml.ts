import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('ctf');
  const labs = await getCollection('labs');
  
  return rss({
    title: 'KhidirID Blog',
    description: 'CTF writeups and cloud security labs',
    site: context.site!,
    items: [...posts, ...labs].map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/${post.collection}/${post.slug}/`,
    })),
  });
}
