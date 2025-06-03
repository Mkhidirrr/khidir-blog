import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['Daily', 'Security News', 'Tutorials', 'Tools Review']),
    date: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    description: z.string(),
  })
});

export const collections = {
  'blog': blogCollection,
};
