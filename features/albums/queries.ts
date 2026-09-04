import { Prisma } from '../../app/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import {
  SortField,
  SortDirection,
  defaultDirectionForField,
} from '@/lib/sort-ratings';

import type { RatedStatus } from '@/features/albums/components/album-rated-filter';

const NO_USER = '__no_user__';

function activeRotationWhere(now: Date): Prisma.RotationAlbumWhereInput {
  return {
    closedAt: null,
    rotation: { startDate: { lte: now }, endDate: { gte: now } },
  };
}

type AlbumWithRelations = Prisma.AlbumGetPayload<{
  include: {
    artists: {
      include: {
        artist: {
          select: { id: true; name: true; slug: true; image: true };
        };
      };
    };
    genres: {
      include: {
        genre: { select: { id: true; name: true; slug: true } };
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
    rotations: {
      where: { closedAt: { not: null } };
      include: {
        rotation: {
          select: {
            id: true;
            name: true;
            slug: true;
            startDate: true;
            endDate: true;
          };
        };
      };
    };
    socialLinks: true;
  };
}>;

function buildAlbumSummarySelect(userId?: string) {
  const now = new Date();
  return {
    id: true,
    title: true,
    slug: true,
    coverImage: true,
    releaseDate: true,
    createdAt: true,
    averageRating: true,
    ratingCount: true,
    artists: {
      select: { artist: { select: { id: true, name: true, slug: true } } },
    },
    genres: {
      select: {
        genre: { select: { id: true, name: true, slug: true } },
      },
    },
    ratings: {
      where: { userId: userId ?? NO_USER },
      select: { score: true },
      take: 1,
    },
    rotations: {
      where: activeRotationWhere(now),
      select: { rotationId: true },
      take: 1,
    },
  } satisfies Prisma.AlbumSelect;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const albumSummarySelect = buildAlbumSummarySelect();

type AlbumSummaryRaw = Prisma.AlbumGetPayload<{
  select: typeof albumSummarySelect;
}>;

export type AlbumFull = Awaited<ReturnType<typeof getAlbumWithAverageRating>>;

export type AlbumTrack = Exclude<AlbumFull, null>['tracks'][number];

export type AlbumSummary = Omit<
  AlbumSummaryRaw,
  'ratings' | 'genres' | 'rotations'
> & {
  artist: string;
  artistNames: string[];
  genreNames: string[];
  genreSlugs: string[];
  userRating: number | null;
  openForRatings: boolean;
};

export type RotationHistoryEntry = {
  rotationId: string;
  name: string;
  slug: string | null;
  startDate: Date;
  endDate: Date;
  averageRating: number | null;
  ratingCount: number;
};

type AlbumsQuery = {
  page?: number;
  pageSize?: number;
  query?: string;
  genre?: string;
  status?: 'All' | 'InRotation' | 'NotInRotation';
  sortField?: SortField;
  sortDirection?: SortDirection;
  rated?: RatedStatus;
  userId?: string;
};

export async function isAlbumOpenForRatings(albumId: string): Promise<boolean> {
  const now = new Date();

  const active = await prisma.rotationAlbum.findFirst({
    where: { albumId, ...activeRotationWhere(now) },
    select: { id: true },
  });

  return active !== null;
}
function buildAlbumWhere({
  query,
  genre,
  status,
  rated,
  userId,
}: Pick<
  AlbumsQuery,
  'query' | 'genre' | 'status' | 'rated' | 'userId'
>): Prisma.AlbumWhereInput {
  const now = new Date();

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
    ...(genre &&
      genre !== 'All' && {
        genres: { some: { genre: { slug: genre } } },
      }),
    ...(status &&
      status !== 'All' && {
        rotations:
          status === 'InRotation'
            ? { some: activeRotationWhere(now) }
            : { none: activeRotationWhere(now) },
      }),
    // Only applied when there's a userId to evaluate it against — the
    // caller (getAlbumsPage) is responsible for not passing `rated` when
    // userId is undefined, since "rated by whom?" has no answer otherwise.
    ...(rated &&
      rated !== 'All' &&
      userId && {
        ratings:
          rated === 'Rated' ? { some: { userId } } : { none: { userId } },
      }),
  };
}

// Returns null for 'user-score' — that case can't be expressed as a Prisma
// orderBy (see getAlbumsPageSortedByUserRating) and is handled by the caller.
function sortFieldToOrderBy(
  field: SortField,
  direction: SortDirection
): Prisma.AlbumOrderByWithRelationInput | null {
  switch (field) {
    case 'az':
      return { title: direction };
    case 'public-score':
      // NOTE: `nulls: 'last'` requires a Prisma version with sortable-nulls
      // support (stable since ~4.16). If this errors or isn't supported on
      // your version, drop the object form back to `{ averageRating: direction }`
      // and unrated albums will sort to whichever end `direction` implies instead.
      return { averageRating: { sort: direction, nulls: 'last' } };
    case 'user-score':
      return null;
    case 'recent':
    default:
      return { createdAt: direction };
  }
}

function normalizeAlbum(album: AlbumWithRelations) {
  const artistNames = album.artists
    .map(entry => entry.artist.name)
    .filter(Boolean);

  const genreNames = album.genres.map(entry => entry.genre.name);
  const genreSlugs = album.genres.map(entry => entry.genre.slug);

  const rotationHistory: RotationHistoryEntry[] = album.rotations
    .map(ra => ({
      rotationId: ra.rotation.id,
      name: ra.rotation.name,
      slug: ra.rotation.slug,
      startDate: ra.rotation.startDate,
      endDate: ra.rotation.endDate,
      averageRating: ra.averageRating,
      ratingCount: ra.ratingCount,
    }))
    .sort((a, b) => b.endDate.getTime() - a.endDate.getTime());

  return {
    ...album,
    artist: artistNames.join(', '),
    artistNames,
    genreNames,
    genreSlugs,
    tracklist: album.tracks.map((track: { title: string }) => track.title),
    rotationHistory,
  };
}

function normalizeAlbumSummary(album: AlbumSummaryRaw): AlbumSummary {
  const { ratings, genres, rotations, ...rest } = album;
  const artistNames = album.artists.map(a => a.artist.name).filter(Boolean);
  const genreNames = genres.map(g => g.genre.name);
  const genreSlugs = genres.map(g => g.genre.slug);

  return {
    ...rest,
    artist: artistNames.join(', '),
    artistNames,
    genreNames,
    genreSlugs,
    userRating: ratings[0]?.score ?? null,
    openForRatings: rotations.length > 0,
  };
}

export async function getAlbumsPage({
  page = 1,
  pageSize = 20,
  query,
  genre,
  status,
  sortField = 'recent',
  sortDirection,
  rated,
  userId,
}: AlbumsQuery = {}) {
  const where = buildAlbumWhere({ query, genre, status, rated, userId });
  const direction = sortDirection ?? defaultDirectionForField[sortField];

  if (sortField === 'user-score' && userId) {
    return getAlbumsPageSortedByUserRating({
      where,
      page,
      pageSize,
      userId,
      direction,
    });
  }
  const orderBy = sortFieldToOrderBy(sortField, direction) ?? {
    createdAt: 'desc' as const,
  };

  const [albums, total] = await Promise.all([
    prisma.album.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: buildAlbumSummarySelect(userId),
      orderBy,
    }),
    prisma.album.count({ where }),
  ]);

  return {
    albums: albums.map(normalizeAlbumSummary),
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

// Handles sort=user-score. Since a viewer's rating lives in a relation
// filtered to their own userId (not an aggregate Prisma can order by), this
// pulls every matching album id, sorts that id list in JS against a lookup
// of the viewer's scores, then pages and fetches full rows for just the
// requested page — in the order already determined.
//
// Cost note: step 1 fetches ids for the *entire* filtered set, unpaginated.
// Fine at catalog sizes where "all matching album ids" is a cheap query
// (indexed, ids only); worth revisiting if that set regularly reaches into
// the tens of thousands.
async function getAlbumsPageSortedByUserRating({
  where,
  page,
  pageSize,
  userId,
  direction,
}: {
  where: Prisma.AlbumWhereInput;
  page: number;
  pageSize: number;
  userId: string;
  direction: SortDirection;
}) {
  const matching = await prisma.album.findMany({
    where,
    select: { id: true },
  });
  const ids = matching.map(a => a.id);
  const total = ids.length;

  if (ids.length === 0) {
    return { albums: [], total: 0, totalPages: 0 };
  }

  const myRatings = await prisma.rating.findMany({
    where: { userId, albumId: { in: ids } },
    select: { albumId: true, score: true },
  });
  const scoreByAlbumId = new Map(myRatings.map(r => [r.albumId, r.score]));

  // Unrated albums always sort last, regardless of direction — same
  // convention as the in-memory sortRatings() for consistency.
  const dir = direction === 'asc' ? 1 : -1;
  const sortedIds = [...ids].sort((a, b) => {
    const aScore = scoreByAlbumId.get(a);
    const bScore = scoreByAlbumId.get(b);
    const aRated = aScore != null;
    const bRated = bScore != null;
    if (!aRated && !bRated) return 0;
    if (!aRated) return 1;
    if (!bRated) return -1;
    return dir * (aScore! - bScore!);
  });

  const pageIds = sortedIds.slice((page - 1) * pageSize, page * pageSize);

  const rows = await prisma.album.findMany({
    where: { id: { in: pageIds } },
    select: buildAlbumSummarySelect(userId),
  });

  // `id: { in }` doesn't preserve array order, so re-sort rows to match
  // pageIds before returning.
  const rowsById = new Map(rows.map(r => [r.id, r]));
  const orderedRows = pageIds
    .map(id => rowsById.get(id))
    .filter((r): r is AlbumSummaryRaw => r != null);

  return {
    albums: orderedRows.map(normalizeAlbumSummary),
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
      genres: {
        include: {
          genre: { select: { id: true, name: true, slug: true } },
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
      rotations: {
        where: { closedAt: { not: null } },
        orderBy: { rotation: { endDate: 'desc' } },
        include: {
          rotation: {
            select: {
              id: true,
              name: true,
              slug: true,
              startDate: true,
              endDate: true,
            },
          },
        },
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

  return {
    ...album,
    tracks: tracksWithRatings,
    albumAverageRating: album.averageRating,
    ratingCount: album.ratingCount,
    openForRatings: await isAlbumOpenForRatings(album.id),
  };
}

export async function getRecentReviewsByArtist(artistId: string, limit = 5) {
  const ratings = await prisma.rating.findMany({
    where: {
      album: { artists: { some: { artistId } } },
      comment: { isNot: null },
    },
    select: {
      id: true,
      score: true,
      createdAt: true,
      user: { select: { id: true, username: true, image: true } },
      comment: { select: { body: true } },
      album: {
        select: { id: true, title: true, slug: true, coverImage: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return ratings.map(r => ({
    id: r.id,
    score: r.score,
    createdAt: r.createdAt,
    user: r.user,
    comment: r.comment?.body ?? null,
    album: r.album,
  }));
}

export type ArtistReviewSummary = Awaited<
  ReturnType<typeof getRecentReviewsByArtist>
>[number];
