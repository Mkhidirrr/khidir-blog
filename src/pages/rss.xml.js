import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function get(context) {
  const allContent = [
    ...(await getCollection('ctf')),
    ...(await getCollection('labs'))
  ].sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());

  return rss({
    title: 'Security Notes | CTF & Cloud Security',
    description: 'Personal blog about Cybersecurity, CTF writeups, and cloud security labs',
    site: context.site,
    items: allContent.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description,
      link: `/${post.collection}/${post.slug}/`,
    })),
  });
}
