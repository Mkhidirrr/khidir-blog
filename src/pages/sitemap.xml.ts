import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET({ site }: APIContext) {
  const allContent = [
    ...(await getCollection('ctf')),
    ...(await getCollection('labs'))
  ];

  const sitemap = generateSitemap(site, allContent);
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}

function generateSitemap(site: string, posts: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${posts
        .map(
          (post) => `
        <url>
          <loc>${new URL(`/${post.collection}/${post.slug}/`, site)}</loc>
          <lastmod>${post.data.date}</lastmod>
          <priority>0.8</priority>
          <changefreq>weekly</changefreq>
        </url>`
        )
        .join('')}
    </urlset>`;
}