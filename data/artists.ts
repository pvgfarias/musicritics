// data/artists.ts
import { SortKey } from '@/lib/sort-ratings';
import { Prisma } from '../app/generated/prisma/client';
import { prisma } from '@/lib/prisma';

type ArtistsQuery = {
  page?: number;
  pageSize?: number;
  query?: string;
  genre?: string;
  status?: string;
  sort?: SortKey;
  userId?: string; // pass the logged-in viewer's id to get their own average back
};

const NO_USER = '__no_user__';

function buildArtistSummarySelect(userId?: string) {
  return {
    id: true,
    name: true,
    slug: true,
    image: true,
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

// Kept for the type helper below — shape is identical regardless of userId.
const artistSummarySelect = buildArtistSummarySelect();

type ArtistSummaryRaw = Prisma.ArtistGetPayload<{
  select: typeof artistSummarySelect;
}>;

export type ArtistSummary = Omit<ArtistSummaryRaw, 'albums'> & {
  albumsCount: number;
  averageRating: number | null;
  ratingCount: number;
  userAverageRating: number | null;
  userRatingCount: number;
};

function sortKeyToOrderBy(
  sort?: SortKey
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
}: Pick<ArtistsQuery, 'query'>): Prisma.ArtistWhereInput {
  return {
    ...(query && {
      OR: [{ name: { contains: query, mode: 'insensitive' } }],
    }),
  };
}

function normalizeArtistSummary(artist: ArtistSummaryRaw): ArtistSummary {
  const { albums, ...rest } = artist;
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
  };
}

export async function getArtistsPage({
  page = 1,
  pageSize = 20,
  query,
  sort,
  userId,
}: ArtistsQuery = {}) {
  const where = buildArtistWhere({ query });

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

export async function getArtistBySlug(slug: string, userId?: string) {
  const artist = await prisma.artist.findUnique({
    where: { slug },
    select: buildArtistSummarySelect(userId),
  });

  if (!artist) return null;
  return normalizeArtistSummary(artist);
}
