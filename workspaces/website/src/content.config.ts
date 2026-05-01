import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blahg = defineCollection({
  loader: glob({ pattern: '**/[!_]*.md', base: './src/content/blahg' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pageTitle: z.string().optional(),
    pageDescription: z.string().optional(),
    pubDate: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    updatedDate: z
      .string()
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),
    heroImage: z.string().optional(),
    heroImageDesc: z.string().optional(),
    series: z.string().optional(),
    schemaType: z.string().default('BlogPosting'),
  }),
});

export const collections = { blahg };
