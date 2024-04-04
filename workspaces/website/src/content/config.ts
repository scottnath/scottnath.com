import { defineCollection, reference, z } from 'astro:content';

const series = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
		heroImage: z.string().optional(),
    heroImageDesc: z.string().optional(),
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val))
      .optional(),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined))
      .optional(),
  }),
});

const blahg = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
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
    series: reference(series).optional(),
	}),
});

export const collections = { blahg, series };
