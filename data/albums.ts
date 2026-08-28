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

// Lightweight list-view select. No longer pulls raw Rating rows just to
// average them — averageRating/ratingCount are denormalized columns on
// Album, kept in sync by upsertAlbumRating/deleteAlbumRating below.
//
// The `ratings` relation here is intentionally still selected, but filtered
// down to (at most) the current viewer's own rating via `where: { userId }`.
// That's a different concern than the average: "does this one user have a
// rating" is always 0-or-1 row per album, so it never had the overhead
// problem the average did — it just needs a real userId to filter on, so
// when there's no logged-in viewer we filter on a value no rating can ever
// have and always get an empty array back.
const NO_USER = '__no_user__';

function buildAlbumSummarySelect(userId?: string) {
  return {
    id: true,
    title: true,
    slug: true,
    coverImage: true,
    releaseDate: true,
    genre: true,
    finalized: true,
    createdAt: true,
    averageRating: true,
    ratingCount: true,
    artists: {
      select: { artist: { select: { id: true, name: true, slug: true } } },
    },
    ratings: {
      where: { userId: userId ?? NO_USER },
      select: { score: true },
      take: 1,
    },
  } satisfies Prisma.AlbumSelect;
}

// Kept for the type helper below — shape is identical regardless of userId.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const albumSummarySelect = buildAlbumSummarySelect();

type AlbumSummaryRaw = Prisma.AlbumGetPayload<{
  select: typeof albumSummarySelect;
}>;

export type AlbumFull = Awaited<ReturnType<typeof getAlbumWithAverageRating>>;

export type AlbumTrack = Exclude<AlbumFull, null>['tracks'][number];

export type AlbumSummary = Omit<AlbumSummaryRaw, 'ratings'> & {
  artist: string;
  artistNames: string[];
  userRating: number | null;
};

type AlbumsQuery = {
  page?: number;
  pageSize?: number;
  query?: string;
  genre?: string;
  status?: string;
  sort?: SortKey;
  userId?: string; // pass the logged-in viewer's id to get their own rating back
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

function normalizeAlbumSummary(album: AlbumSummaryRaw): AlbumSummary {
  const { ratings, ...rest } = album;
  const artistNames = album.artists.map(a => a.artist.name).filter(Boolean);

  return {
    ...rest,
    artist: artistNames.join(', '),
    artistNames,
    userRating: ratings[0]?.score ?? null,
  };
}

export async function getAlbumsPage({
  page = 1,
  pageSize = 20,
  query,
  genre,
  status,
  sort,
  userId,
}: AlbumsQuery = {}) {
  const where = buildAlbumWhere({ query, genre, status });

  const [albums, total] = await Promise.all([
    prisma.album.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: buildAlbumSummarySelect(userId),
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
  pageSize = 20,
  userId?: string
) {
  const [albums, total] = await Promise.all([
    prisma.album.findMany({
      where: { artists: { some: { artistId } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: buildAlbumSummarySelect(userId),
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

  // Track-level averages aren't denormalized (yet) — a single album detail
  // page fetch is cheap enough to compute these in JS. If track pages ever
  // get their own high-traffic list view, apply the same pattern used for
  // Album to TrackRating.
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

  return {
    ...album,
    tracks: tracksWithRatings,
    albumAverageRating: album.averageRating,
    ratingCount: album.ratingCount,
    openForRatings: isAlbumOpenForRatings(album),
  };
}

// --- Rating mutations -------------------------------------------------
// These are the only supported entry points for writing an album Rating.
// Going through prisma.rating.create/update/delete directly instead of
// these will leave Album.averageRating / Album.ratingCount stale.

export async function upsertAlbumRating(
  userId: string,
  albumId: string,
  score: number
) {
  return prisma.$transaction(async tx => {
    const rating = await tx.rating.upsert({
      where: { userId_albumId: { userId, albumId } },
      create: { userId, albumId, score },
      update: { score },
    });

    await recomputeAlbumAggregate(tx, albumId);

    return rating;
  });
}

export async function deleteAlbumRating(userId: string, albumId: string) {
  return prisma.$transaction(async tx => {
    await tx.rating.delete({
      where: { userId_albumId: { userId, albumId } },
    });

    await recomputeAlbumAggregate(tx, albumId);
  });
}

async function recomputeAlbumAggregate(
  tx: Prisma.TransactionClient,
  albumId: string
) {
  const agg = await tx.rating.aggregate({
    where: { albumId },
    _avg: { score: true },
    _count: { score: true },
  });

  await tx.album.update({
    where: { id: albumId },
    data: {
      averageRating: agg._avg.score,
      ratingCount: agg._count.score,
    },
  });
}
