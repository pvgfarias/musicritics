import { prisma } from '@/lib/prisma';

// A write is only allowed while the album belongs to a Rotation that's
// currently active (now is within its window) and hasn't been closed yet.
// Returns the rotationId to write against, or null if writes should be
// rejected.
async function getActiveRotationId(albumId: string): Promise<string | null> {
  const now = new Date();

  const active = await prisma.rotationAlbum.findFirst({
    where: {
      albumId,
      closedAt: null,
      rotation: { startDate: { lte: now }, endDate: { gte: now } },
    },
    select: { rotationId: true },
  });

  return active?.rotationId ?? null;
}

export async function upsertAlbumRating(
  userId: string,
  albumId: string,
  score: number
) {
  const rotationId = await getActiveRotationId(albumId);
  if (!rotationId) {
    throw new Error('This album is not currently open for ratings.');
  }

  // No aggregate recompute here. Album.averageRating/ratingCount are only
  // ever written by the rotation close job — a rating made mid-cycle stays
  // invisible in the public score until that cycle closes, by design.
  return prisma.rating.upsert({
    where: { userId_albumId_rotationId: { userId, albumId, rotationId } },
    create: { userId, albumId, rotationId, score },
    update: { score },
  });
}

export async function deleteAlbumRating(userId: string, albumId: string) {
  const rotationId = await getActiveRotationId(albumId);
  if (!rotationId) {
    // Either the album was never in an active rotation, or its rotation
    // has since closed — either way, deletion isn't allowed. Closed
    // ratings are locked and only go away via account deletion cascade.
    throw new Error(
      'This rating can no longer be deleted — its rotation has closed.'
    );
  }

  await prisma.rating.delete({
    where: { userId_albumId_rotationId: { userId, albumId, rotationId } },
  });
}
