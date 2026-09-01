import { prisma } from '@/lib/prisma';
import { Prisma } from '../../app/generated/prisma/client';

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

export async function recomputeAlbumAggregate(
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
