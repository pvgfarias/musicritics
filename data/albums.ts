// data/albums.ts
import { Prisma } from '../app/generated/prisma/client';
import { prisma } from '@/lib/prisma';

type AlbumWithRelations = Prisma.AlbumGetPayload<{
  include: {
    artists: {
      include: {
        artist: {
          select: { id: true; name: true; slug: true; image: true };
        };
      };
    };
    tracks: {
      include: {
        ratings: {
          select: { score: true };
        };
      };
    };
    ratings: {
      include: {
        user: { select: { id: true; username: true; image: true } };
      };
    };
    socialLinks: true;
  };
}>;

const albumSummarySelect = {
  id: true,
  title: true,
  slug: true,
  coverImage: true,
  releaseYear: true,
  genre: true,
  createdAt: true,
  artists: {
    select: { artist: { select: { id: true, name: true, slug: true } } },
  },
  _count: { select: { ratings: true } },
  ratings: { select: { score: true } },
} satisfies Prisma.AlbumSelect;

type AlbumSummaryRaw = Prisma.AlbumGetPayload<{
  select: typeof albumSummarySelect;
}>;

export type AlbumSummary = AlbumSummaryRaw & {
  artist: string;
  artistNames: string[];
  ratingCount: number;
  averageRating: number | null;
};

function normalizeAlbum(album: AlbumWithRelations) {
  const artistNames = album.artists
    .map(entry => entry.artist.name)
    .filter(Boolean);

  return {
    ...album,
    artist: artistNames.join(', '),
    artistNames,
    tracklist: album.tracks.map((track: { title: string }) => track.title),
  };
}

function normalizeAlbumSummary(album: AlbumSummaryRaw) {
  const artistNames = album.artists.map(a => a.artist.name).filter(Boolean);
  const scores = album.ratings
    .map(rating => rating.score)
    .filter((score): score is number => score != null);
  const averageRating = scores.length
    ? scores.reduce((sum, score) => sum + score, 0) / scores.length
    : null;

  return {
    ...album,
    artist: artistNames.join(', '),
    artistNames,
    ratingCount: album._count.ratings,
    averageRating,
  };
}

export async function getAlbumsPage(page = 1, pageSize = 20) {
  const [albums, total] = await Promise.all([
    prisma.album.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: albumSummarySelect,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.album.count(),
  ]);

  return {
    albums: albums.map(normalizeAlbumSummary),
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAlbumsByArtist(
  artistId: string,
  page = 1,
  pageSize = 20
) {
  const [albums, total] = await Promise.all([
    prisma.album.findMany({
      where: { artists: { some: { artistId } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: albumSummarySelect,
      orderBy: { releaseYear: 'desc' },
    }),
    prisma.album.count({ where: { artists: { some: { artistId } } } }),
  ]);

  return {
    albums: albums.map(normalizeAlbumSummary),
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAlbumBySlug(slug: string) {
  const album = await prisma.album.findUnique({
    where: { slug },
    include: {
      artists: {
        include: {
          artist: {
            select: { id: true, name: true, slug: true, image: true },
          },
        },
      },
      tracks: {
        orderBy: { number: 'asc' },
        include: {
          ratings: {
            select: { score: true },
          },
        },
      },
      ratings: {
        include: {
          user: { select: { id: true, username: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      socialLinks: {
        orderBy: { platform: 'asc' },
      },
    },
  });

  if (!album) return null;
  return normalizeAlbum(album);
}

export async function getAlbumWithAverageRating(slug: string) {
  const album = await getAlbumBySlug(slug);
  if (!album) return null;

  const trackScores = (
    album.tracks as Array<{ ratings: Array<{ score: number | null }> }>
  ).flatMap(track =>
    track.ratings
      .map(rating => rating.score)
      .filter((score): score is number => score != null)
  );

  const albumScores = (
    album.ratings as Array<{ score: number | null }>
  ).flatMap(rating => (rating.score == null ? [] : [rating.score]));

  const trackAvg = trackScores.length
    ? trackScores.reduce((a, b) => a + b, 0) / trackScores.length
    : null;
  const albumAvg = albumScores.length
    ? albumScores.reduce((a, b) => a + b, 0) / albumScores.length
    : null;

  return {
    ...album,
    trackAverageRating: trackAvg,
    albumAverageRating: albumAvg,
    ratingCount: album.ratings.length,
  };
}
