// data/albums.ts
import { prisma } from '@/lib/prisma';

export async function getAllAlbums() {
  return prisma.album.findMany({
    include: { artist: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAlbumBySlug(slug: string) {
  return prisma.album.findUnique({
    where: { slug },
    include: {
      artist: true,
      ratings: {
        include: {
          user: { select: { id: true, username: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function getAlbumsByArtist(artistId: string) {
  return prisma.album.findMany({
    where: { artistId },
    orderBy: { releaseYear: 'desc' },
  });
}

export async function getAlbumWithAverageRating(slug: string) {
  const album = await getAlbumBySlug(slug);
  if (!album) return null;

  const avg =
    album.ratings.length > 0
      ? album.ratings.reduce((sum, r) => sum + r.score, 0) /
        album.ratings.length
      : null;

  return { ...album, averageRating: avg, ratingCount: album.ratings.length };
}
