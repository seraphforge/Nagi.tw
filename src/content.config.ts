import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categoryOrder } from './lib/categories';

const articles = defineCollection({
  loader: glob({
    base: './articles',
    pattern: '**/*.{md,mdx}',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ''),
  }),
  schema: z.object({
    title: z.string(), date: z.coerce.date(), updated: z.coerce.date().optional(),
    published: z.boolean().optional(), tags: z.array(z.string()), categories: z.tuple([z.enum(categoryOrder)]),
    description: z.string().optional(), banner: z.string().optional(), cover: z.string().optional(),
    site_lang: z.string().optional(), translation_key: z.string().optional(), slug: z.string().optional(),
    featured: z.boolean().optional(), toc: z.boolean().optional(),
    hub_section: z.enum(['competitions', 'learning', 'teaching']).optional(),
  }),
});

export const collections = { articles };
