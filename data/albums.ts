// data/albums.ts
import { Prisma } from '../app/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { SortKey } from '@/lib/sort-ratings';

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
          include: {
            user: { select: { id: true; username: true; image: true } };
            comment: {
              include: {
                author: { select: { id: true; username: true; image: true } };
              };
            };
          };
        };
      };
    };
    ratings: {
      include: {
        user: { select: { id: true; username: true; image: true } };
        comment: {
          include: {
            author: { select: { id: true; username: true; image: true } };
          };
        };
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
  releaseDate: true,
  genre: true,
  finalized: true,
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

export type AlbumFull = Awaited<ReturnType<typeof getAlbumWithAverageRating>>;

export type AlbumSummary = AlbumSummaryRaw & {
  artist: string;
  artistNames: string[];
  ratingCount: number;
  averageRating: number | null;
};

type AlbumsQuery = {
  page?: number;
  pageSize?: number;
  query?: string;
  genre?: string;
  status?: string;
  sort?: SortKey;
};

// An album accepts new ratings from users as long as it hasn't been finalized.
export function isAlbumOpenForRatings(album: { finalized: boolean }) {
  return !album.finalized;
}

function buildAlbumWhere({
  query,
  genre,
  status,
}: Pick<AlbumsQuery, 'query' | 'genre' | 'status'>): Prisma.AlbumWhereInput {
  return {
    ...(query && {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        {
          artists: {
            some: {
              artist: { name: { contains: query, mode: 'insensitive' } },
            },
          },
        },
      ],
    }),
    ...(genre && genre !== 'All' && { genre }),
    ...(status &&
      status !== 'All' && {
        finalized: status === 'Finalized',
      }),
  };
}

function sortKeyToOrderBy(
  sort?: SortKey
): Prisma.AlbumOrderByWithRelationInput {
  switch (sort) {
    case 'az':
      return { title: 'asc' };
    case 'recent':
    default:
      return { createdAt: 'desc' };
  }
}

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

export async function getAlbumsPage({
  page = 1,
  pageSize = 20,
  query,
  genre,
  status,
  sort,
}: AlbumsQuery = {}) {
  const where = buildAlbumWhere({ query, genre, status });

  const [albums, total] = await Promise.all([
    prisma.album.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: albumSummarySelect,
      orderBy: sortKeyToOrderBy(sort),
    }),
    prisma.album.count({ where }),
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
      orderBy: { releaseDate: 'desc' },
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
            include: {
              user: { select: { id: true, username: true, image: true } },
              comment: {
                include: {
                  author: {
                    select: { id: true, username: true, image: true },
                  },
                },
              },
            },
          },
        },
      },
      ratings: {
        include: {
          user: { select: { id: true, username: true, image: true } },
          comment: {
            include: {
              author: { select: { id: true, username: true, image: true } },
            },
          },
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

  const tracksWithRatings = album.tracks.map(track => {
    const scores = track.ratings
      .map(rating => rating.score)
      .filter((score): score is number => score != null);

    const averageRating = scores.length
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : null;

    return {
      ...track,
      averageRating,
      ratingCount: scores.length,
    };
  });

  const albumScores = album.ratings.flatMap(rating =>
    rating.score == null ? [] : [rating.score]
  );

  const albumAvg = albumScores.length
    ? albumScores.reduce((a, b) => a + b, 0) / albumScores.length
    : null;

  return {
    ...album,
    tracks: tracksWithRatings,
    albumAverageRating: albumAvg,
    ratingCount: album.ratings.length,
    openForRatings: isAlbumOpenForRatings(album),
  };
}
