import { defineCollection, z } from 'astro:content';

const ctfCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    platform: z.enum(['HTB', 'THM', 'PicoCTF', 'OverTheWire', 'RootMe', 'Other']),
    category: z.enum([
      'web', 'crypto', 'pwn', 'reverse', 'forensics', 'misc',
      'red', 'blue', 'purple'  // Add THM categories
    ]).optional(),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    date: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    description: z.string(),
    points: z.number().optional(),
    solved: z.boolean().default(false),
    images: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
  }),
  type: 'content',
});

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    category: z.enum(['Daily', 'Security News', 'Tutorials', 'Tools Review']),
    date: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    description: z.string(),
    images: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
  }),
  type: 'content',
});

const docsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
  type: 'content',
});

export const collections = {
  'ctf': ctfCollection,
  'blog': blogCollection,
  'docs': docsCollection,
};
