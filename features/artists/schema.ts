import { z } from 'zod';
// Adjust to your actual shared schemas location
import { streamingLinkSchema } from '@/lib/shared-schema';

export const createArtistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Lowercase letters, numbers, and hyphens only'
    ),
  image: z.string().nullable(),
  bio: z.string().max(1000, 'Keep it under 1000 characters').nullable(),
  country: z
    .string()
    .regex(/^[A-Z]{2}$/, 'Use a 2-letter ISO country code, e.g. US')
    .nullable(),
  genreIds: z.array(z.string()),
  debutDate: z.date().nullable(),
  disbandedDate: z.date().nullable(),
  streamingLinks: z.array(streamingLinkSchema),
});

export type CreateArtistInput = z.infer<typeof createArtistSchema>;

export const updateArtistSchema = createArtistSchema.extend({
  id: z.string().min(1),
});

export type UpdateArtistInput = z.infer<typeof updateArtistSchema>;
