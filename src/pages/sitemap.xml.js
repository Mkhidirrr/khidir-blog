import { getCollection } from 'astro:content';

export async function get({ site }) {
  const allContent = [
    ...(await getCollection('ctf')),
    ...(await getCollection('labs'))
  ];

  return {
    body: generateSitemap(site, allContent),
    headers: {
      'Content-Type': 'application/xml',
    },
  };
}

function generateSitemap(site, posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${posts
        .map(
          (post) => `
        <url>
          <loc>${new URL(`/${post.collection}/${post.slug}/`, site)}</loc>
          <lastmod>${post.data.date}</lastmod>
        </url>`
        )
        .join('')}
    </urlset>`;
}
