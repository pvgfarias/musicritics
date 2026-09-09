import { z } from 'zod';
// Adjust to your actual shared schemas location
import { streamingLinkSchema } from '@/lib/shared-schema';

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

export const releaseTypeSchema = z.enum([
  'LP',
  'EP',
  'SINGLE',
  'COMPILATION',
  'LIVE',
  'MIXTAPE',
  'SOUNDTRACK',
]);

export const albumArtistSchema = z.object({
  artistId: z.string(),
  // No .default() here — zodResolver's generic types against z.infer's
  // *input* shape, where a schema-level default makes the field optional,
  // while CreateAlbumInput (z.infer output) makes it required. Mixing the
  // two breaks useForm<CreateAlbumInput>()'s resolver typing. Default is
  // supplied in code instead: useAlbumForm's handleArtistsChange already
  // does `role: a.role ?? 'PRIMARY'`.
  role: z.enum(['PRIMARY', 'FEATURED', 'PRODUCER']),
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
  // No .default() — same reasoning as albumArtistSchema.role above.
  // Whatever builds this form's defaultValues (the create-album page)
  // needs to pass `releaseType: 'LP'` explicitly for new albums.
  releaseType: releaseTypeSchema,
  labelId: z.string().nullable().optional(),
  genreIds: z.array(z.string()).min(1, 'At least one genre is required'),
  artists: z.array(albumArtistSchema).min(1, 'At least one artist is required'),
  tracks: z.array(trackSchema).min(1, 'At least one track is required'),
  streamingLinks: z.array(streamingLinkSchema),
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
