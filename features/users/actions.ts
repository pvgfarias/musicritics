// features/users/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '../auth/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

type ActionResult = { success: true } | { success: false; error: string };

const MAX_FAVORITES = 10;

// Sentinel error thrown *inside* the $transaction callback so the
// count-check and the insert stay atomic — thrown here, caught outside,
// turned into a normal ActionResult. Prevents the race where two rapid
// clicks (or two tabs) both pass a count check done as a separate,
// non-transactional step before either insert lands.
class FavoritesLimitError extends Error {}

async function getCurrentUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error('Unauthorized');
  return session.user.id;
}

export async function toggleFavoriteAlbum(
  albumId: string,
  isCurrentlyFavorited: boolean
): Promise<ActionResult> {
  const userId = await getCurrentUserId();

  if (isCurrentlyFavorited) {
    await prisma.userFavoriteAlbum.delete({
      where: { userId_albumId: { userId, albumId } },
    });
    revalidatePath('/profile');
    return { success: true };
  }

  try {
    await prisma.$transaction(async tx => {
      const count = await tx.userFavoriteAlbum.count({ where: { userId } });
      if (count >= MAX_FAVORITES) {
        throw new FavoritesLimitError(
          `You can only favorite up to ${MAX_FAVORITES} albums.`
        );
      }

      // max(position)+1 rather than count+1 — after a deletion, count()
      // no longer matches the highest position in use (e.g. 3 favorites
      // at positions 1/2/3, remove position 2, count is now 2 but 3 is
      // still taken), and count+1 would collide with it under the
      // @@unique([userId, position]) constraint.
      const maxPosition = await tx.userFavoriteAlbum.aggregate({
        where: { userId },
        _max: { position: true },
      });
      const nextPosition = (maxPosition._max.position ?? 0) + 1;

      await tx.userFavoriteAlbum.create({
        data: { userId, albumId, position: nextPosition },
      });
    });
  } catch (err) {
    if (err instanceof FavoritesLimitError) {
      return { success: false, error: err.message };
    }
    throw err;
  }

  revalidatePath('/profile');
  return { success: true };
}

export async function toggleFavoriteArtist(
  artistId: string,
  isCurrentlyFavorited: boolean
): Promise<ActionResult> {
  const userId = await getCurrentUserId();

  if (isCurrentlyFavorited) {
    await prisma.userFavoriteArtist.delete({
      where: { userId_artistId: { userId, artistId } },
    });
    revalidatePath('/profile');
    return { success: true };
  }

  try {
    await prisma.$transaction(async tx => {
      const count = await tx.userFavoriteArtist.count({ where: { userId } });
      if (count >= MAX_FAVORITES) {
        throw new FavoritesLimitError(
          `You can only favorite up to ${MAX_FAVORITES} artists.`
        );
      }

      const maxPosition = await tx.userFavoriteArtist.aggregate({
        where: { userId },
        _max: { position: true },
      });
      const nextPosition = (maxPosition._max.position ?? 0) + 1;

      await tx.userFavoriteArtist.create({
        data: { userId, artistId, position: nextPosition },
      });
    });
  } catch (err) {
    if (err instanceof FavoritesLimitError) {
      return { success: false, error: err.message };
    }
    throw err;
  }

  revalidatePath('/profile');
  return { success: true };
}
