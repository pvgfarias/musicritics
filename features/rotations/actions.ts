'use server';

import { prisma } from '@/lib/prisma';
import { requirePermission } from '../auth/auth-helpers';
import { revalidatePath } from 'next/cache';

type ActionResult = { success: true } | { success: false; error: string };

// Convenience wrapper for admin UI that just wants "toggle this album's
// rotation membership" without picking a specific Rotation — resolves to
// whichever Rotation is currently active (startDate <= now <= endDate).
// If you ever run multiple concurrent rotations, this stops being
// unambiguous and the caller should switch to addAlbumToRotation /
// removeAlbumFromRotation with an explicit rotationId instead.
export async function toggleAlbumInCurrentRotation(
  albumId: string,
  isCurrentlyInRotation: boolean
): Promise<ActionResult> {
  const allowed = await requirePermission({ album: ['update'] });
  if (!allowed) throw new Error('Unauthorized');

  const now = new Date();
  const activeRotation = await prisma.rotation.findFirst({
    where: { startDate: { lte: now }, endDate: { gte: now } },
  });

  if (!activeRotation) {
    return {
      success: false,
      error: 'No rotation is currently active. Create one first.',
    };
  }

  if (isCurrentlyInRotation) {
    await prisma.rotationAlbum.delete({
      where: {
        rotationId_albumId: { rotationId: activeRotation.id, albumId },
      },
    });
  } else {
    await prisma.rotationAlbum.upsert({
      where: {
        rotationId_albumId: { rotationId: activeRotation.id, albumId },
      },
      create: { rotationId: activeRotation.id, albumId },
      update: {},
    });
  }

  revalidatePath('/dashboard/albums');
  return { success: true };
}
