import { getCollection } from 'astro:content';

export async function GET({ url }: { url: URL }) {
  const query = url.searchParams.get('q')?.toLowerCase() || '';
  
  const allContent = [
    ...(await getCollection('ctf')),
    ...(await getCollection('labs'))
  ];
  
  const results = allContent
    .filter(content => {
      const searchContent = [
        content.data.title,
        content.data.platform,
        ...content.data.tags,
        content.body
      ].join(' ').toLowerCase();
      
      return searchContent.includes(query);
    })
    .map(content => ({
      title: content.data.title,
      url: `/${content.collection}/${content.slug}`,
      type: content.collection.toUpperCase(),
      platform: content.data.platform
    }))
    .slice(0, 5);
    
  return new Response(JSON.stringify({ results }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
