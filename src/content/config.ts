import { defineCollection, z } from 'astro:content';

const ctfCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    platform: z.enum(['HTB', 'THM', 'PicoCTF', 'OverTheWire', 'RootMe', 'Other']),
    category: z.enum(['web', 'crypto', 'pwn', 'reverse', 'forensics', 'misc']).optional(),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    date: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    description: z.string(),
    points: z.number().optional(),
    solved: z.boolean().default(false),
  }),
});

const labCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    platform: z.enum(['AWS', 'Azure', 'GCP', 'Other']),
    date: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    cost: z.string().optional(),
    duration: z.string(),
    services: z.array(z.string()),
    description: z.string(),
  }),
});

export const collections = {
  'ctf': ctfCollection,
  'labs': labCollection,
};
