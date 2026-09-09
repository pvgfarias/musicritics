import { z } from 'zod';

export const streamingLinkSchema = z.object({
  platform: z.enum([
    'SPOTIFY',
    'APPLE_MUSIC',
    'DEEZER',
    'TIDAL',
    'YOUTUBE_MUSIC',
    'SOUNDCLOUD',
    'BANDCAMP',
    'AMAZON_MUSIC',
    'OTHER',
  ]),
  url: z.string().url('Must be a valid URL'),
});
