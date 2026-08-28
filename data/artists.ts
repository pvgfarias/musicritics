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
};

const artistSummarySelect = {
  id: true,
  name: true,
  slug: true,
  image: true,
  _count: { select: { albums: true } },
} satisfies Prisma.ArtistSelect;

type ArtistSummaryRaw = Prisma.ArtistGetPayload<{
  select: typeof artistSummarySelect;
}>;

export type ArtistSummary = ArtistSummaryRaw & {
  albumsCount: number;
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

function normalizeArtistSummary(artist: ArtistSummaryRaw) {
  return { ...artist, albumsCount: artist._count.albums };
}
export async function getArtistsPage({
  page = 1,
  pageSize = 20,
  query,
  sort,
}: ArtistsQuery = {}) {
  const where = buildArtistWhere({ query });

  const [artists, total] = await Promise.all([
    prisma.artist.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: artistSummarySelect,
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
