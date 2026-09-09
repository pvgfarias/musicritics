// data/artists.ts
import { Prisma } from '@/app/generated/prisma/client';
import { prisma } from '@/lib/prisma';

type ArtistsQuery = {
  page?: number;
  pageSize?: number;
  query?: string;
  genre?: string; // genre slug
  status?: string;
  sort?: string;
  userId?: string; // pass the logged-in viewer's id to get their own average back
};

const NO_USER = '__no_user__';

function buildArtistSummarySelect(userId?: string) {
  return {
    id: true,
    name: true,
    slug: true,
    image: true,
    bio: true,
    country: true,
    debutDate: true,
    disbandedDate: true,
    genres: {
      select: {
        genre: { select: { id: true, name: true, slug: true } },
      },
    },
    _count: { select: { albums: true } },
    albums: {
      select: {
        album: {
          select: {
            averageRating: true,
            ratingCount: true,
            ratings: {
              where: { userId: userId ?? NO_USER },
              select: { score: true },
              take: 1,
            },
          },
        },
      },
    },
  } satisfies Prisma.ArtistSelect;
}

// Detail-page select: everything in the summary, plus streamingLinks.
// Kept separate from buildArtistSummarySelect so the list page (which
// renders many rows) doesn't pull in a relation it never displays.
function buildArtistDetailSelect(userId?: string) {
  return {
    ...buildArtistSummarySelect(userId),
    streamingLinks: {
      orderBy: { platform: 'asc' },
    },
  } satisfies Prisma.ArtistSelect;
}

// Kept for the type helper below — shape is identical regardless of userId.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const artistSummarySelect = buildArtistSummarySelect();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const artistDetailSelect = buildArtistDetailSelect();

type ArtistSummaryRaw = Prisma.ArtistGetPayload<{
  select: typeof artistSummarySelect;
}>;

type ArtistDetailRaw = Prisma.ArtistGetPayload<{
  select: typeof artistDetailSelect;
}>;

export type ArtistSummary = Omit<ArtistSummaryRaw, 'albums' | 'genres'> & {
  albumsCount: number;
  averageRating: number | null;
  ratingCount: number;
  userAverageRating: number | null;
  userRatingCount: number;
  genreNames: string[];
  genreSlugs: string[];
};

export type ArtistDetail = ArtistSummary & {
  streamingLinks: ArtistDetailRaw['streamingLinks'];
};

function sortKeyToOrderBy(
  sort?: string
): Prisma.ArtistOrderByWithRelationInput {
  switch (sort) {
    case 'az':
      return { name: 'asc' };
    default:
      return { name: 'asc' };
  }
}

function buildArtistWhere({
  query,
  genre,
}: Pick<ArtistsQuery, 'query' | 'genre'>): Prisma.ArtistWhereInput {
  return {
    ...(query && {
      OR: [{ name: { contains: query, mode: 'insensitive' } }],
    }),
    ...(genre &&
      genre !== 'All' && {
        genres: { some: { genre: { slug: genre } } },
      }),
  };
}

function normalizeArtistSummary(artist: ArtistSummaryRaw): ArtistSummary {
  const { albums, genres, ...rest } = artist;
  const albumRecords = albums.map(a => a.album);

  const ratedAlbums = albumRecords.filter(
    a => a.ratingCount > 0 && a.averageRating != null
  );
  const totalRatings = ratedAlbums.reduce((sum, a) => sum + a.ratingCount, 0);
  const weightedSum = ratedAlbums.reduce(
    (sum, a) => sum + (a.averageRating as number) * a.ratingCount,
    0
  );

  const userScores = albumRecords
    .map(a => a.ratings[0]?.score)
    .filter((score): score is number => score != null);
  const userAverageRating = userScores.length
    ? userScores.reduce((sum, score) => sum + score, 0) / userScores.length
    : null;

  return {
    ...rest,
    albumsCount: artist._count.albums,
    averageRating: totalRatings > 0 ? weightedSum / totalRatings : null,
    ratingCount: totalRatings,
    userAverageRating,
    userRatingCount: userScores.length,
    genreNames: genres.map(g => g.genre.name),
    genreSlugs: genres.map(g => g.genre.slug),
  };
}

export async function getArtistsPage({
  page = 1,
  pageSize = 20,
  query,
  genre,
  sort,
  userId,
}: ArtistsQuery = {}) {
  const where = buildArtistWhere({ query, genre });

  const [artists, total] = await Promise.all([
    prisma.artist.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: buildArtistSummarySelect(userId),
      orderBy: sortKeyToOrderBy(sort),
    }),
    prisma.artist.count({ where }),
  ]);

  return {
    artists: artists.map(normalizeArtistSummary),
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getArtistBySlug(
  slug: string,
  userId?: string
): Promise<ArtistDetail | null> {
  const artist = await prisma.artist.findUnique({
    where: { slug },
    select: buildArtistDetailSelect(userId),
  });

  if (!artist) return null;

  // streamingLinks isn't part of ArtistSummaryRaw's shape, so it's pulled
  // out before handing the rest to normalizeArtistSummary (which computes
  // the rating aggregates shared with the list page), then merged back in.
  const { streamingLinks, ...summaryFields } = artist;
  return {
    ...normalizeArtistSummary(summaryFields),
    streamingLinks,
  };
}
