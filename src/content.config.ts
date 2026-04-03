import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog/en' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
    toc: z.boolean().optional().default(true),
    lang: z.string().optional().default('en'),
  }),
});

const blogUa = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog/ua' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
    toc: z.boolean().optional().default(true),
    lang: z.string().optional().default('ua'),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    url: z.string().optional(),
    github: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    order: z.number().optional().default(0),
  }),
});

export const collections = { blog, blogUa, projects };
