export function generateArticleSchema(article: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: 'KhidirID'
    },
    datePublished: article.date,
    dateModified: article.lastModified || article.date,
    image: article.thumbnail,
    url: `https://khidir.dev/${article.collection}/${article.slug}`
  };
}
