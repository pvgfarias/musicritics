import { z } from 'zod';

export const trackSchema = z.object({
  // Present for existing tracks (round-tripped from getAlbumForEdit),
  // absent for tracks newly added in the edit form. updateAlbum uses this
  // to diff tracks by id instead of deleting and recreating all of them
  // on every save — track deletion cascades to Rating, so wholesale
  // replacement was silently wiping every track rating on any album edit.
  id: z.string().optional(),
  title: z.string().min(1, 'Track title is required'),
  number: z.number().int().positive(),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string(),
});

export const createAlbumSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Lowercase letters, numbers, and hyphens only'
    ),
  coverImage: z.string().nullable(),
  releaseDate: z.date().nullable(),
  genreIds: z.array(z.string()).min(1, 'At least one genre is required'),
  artistIds: z.array(z.string()).min(1, 'At least one artist is required'),
  tracks: z.array(trackSchema).min(1, 'At least one track is required'),
  socialLinks: z.array(socialLinkSchema),
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
