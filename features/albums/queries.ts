import { Prisma } from '../../app/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { SortKey } from '@/lib/sort-ratings';

const NO_USER = '__no_user__';

// Selects the caller's own (at most one) rating, and whether the album has
// an unclosed RotationAlbum whose parent Rotation window is active right
// now. Both are cheap, indexed lookups folded into one select rather than
// separate per-row queries.
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
    // Closed-cycle history only — the current, still-open cycle (if any)
    // never has a public score, so it's excluded here on purpose.
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

// Lightweight list-view select. averageRating/ratingCount are still
// denormalized columns on Album (mirrored from the most recently closed
// RotationAlbum by the close job), so this stays a single flat query — no
// join needed just to show a score in a grid.
//
// `ratings` here is filtered to (at most) the current viewer's own rating.
// `rotations` here is filtered to an active, unclosed cycle — its mere
// presence means the album is currently open for ratings.
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

// Kept for the type helper below — shape is identical regardless of userId.
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
  genre?: string; // genre slug
  status?: 'All' | 'InRotation' | 'NotInRotation';
  sort?: SortKey;
  userId?: string; // pass the logged-in viewer's id to get their own rating back
};

// An album accepts new/edited ratings only while it belongs to a Rotation
// whose window is currently active and hasn't been closed yet. This is a
// real query now (there's no boolean on Album to read anymore) — call it
// sparingly on detail pages, and prefer the folded-in `rotations` select
// above for list views to avoid N+1s.
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
}: Pick<AlbumsQuery, 'query' | 'genre' | 'status'>): Prisma.AlbumWhereInput {
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
    // Already ordered by the query, but keep this explicit/local in case
    // the include's orderBy ever changes out from under this function.
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
