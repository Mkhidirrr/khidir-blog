import { defineCollection, z } from 'astro:content';

const ctfCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    platform: z.enum(['HTB', 'THM', 'RootMe']),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    date: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

const labCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    platform: z.enum(['AWS', 'Azure', 'GCP']),
    date: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  'ctf': ctfCollection,
  'labs': labCollection,
};
