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

function generateSitemap(site, posts) {
  // ...existing code...
}