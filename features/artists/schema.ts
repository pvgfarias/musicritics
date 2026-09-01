import { z } from 'zod';

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
});

export type CreateArtistInput = z.infer<typeof createArtistSchema>;

export const updateArtistSchema = createArtistSchema.extend({
  id: z.string().min(1),
});

export type UpdateArtistInput = z.infer<typeof updateArtistSchema>;
