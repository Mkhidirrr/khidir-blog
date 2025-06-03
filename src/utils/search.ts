import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  import.meta.env.PUBLIC_ALGOLIA_APP_ID,
  import.meta.env.PUBLIC_ALGOLIA_SEARCH_KEY
);

const index = searchClient.initIndex('blog_posts');

export async function searchPosts(query: string) {
  const { hits } = await index.search(query);
  return hits.map(hit => ({
    title: hit.title,
    description: hit.description,
    url: hit.url,
    category: hit.category,
    tags: hit.tags
  }));
}
