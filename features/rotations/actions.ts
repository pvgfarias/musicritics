'use server';

import { prisma } from '@/lib/prisma';
import { requirePermission } from '../auth/auth-helpers';
import { revalidatePath } from 'next/cache';
import { searchAlbumsForRotation } from './queries';

type ActionResult = { success: true } | { success: false; error: string };

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

// ──────────────────────────────
// Create
// ──────────────────────────────

type CreateRotationInput = {
  name: string;
  slug?: string | null;
  coverImage?: string | null;
  startDate: Date;
  endDate: Date;
  albumIds: string[];
};

export async function createRotation(
  input: CreateRotationInput
): Promise<ActionResult & { rotationId?: string }> {
  const allowed = await requirePermission({ album: ['manageRotation'] });
  if (!allowed) throw new Error('Unauthorized');

  if (input.endDate <= input.startDate) {
    return { success: false, error: 'End date must be after start date.' };
  }

  // One active rotation at a time — creating a second overlapping one
  // would make "the" active rotation ambiguous everywhere that assumes
  // getActiveRotation() returns a single row.
  const overlapping = await prisma.rotation.findFirst({
    where: {
      startDate: { lte: input.endDate },
      endDate: { gte: input.startDate },
    },
    select: { id: true, name: true },
  });
  if (overlapping) {
    return {
      success: false,
      error: `Overlaps with an existing rotation: "${overlapping.name}".`,
    };
  }

  const rotation = await prisma.rotation.create({
    data: {
      name: input.name,
      slug: input.slug || null,
      coverImage: input.coverImage || null,
      startDate: input.startDate,
      endDate: input.endDate,
      albums: {
        create: input.albumIds.map(albumId => ({ albumId })),
      },
    },
  });

  // Only notify immediately if this rotation is starting right now (or
  // already started) — a rotation scheduled for the future shouldn't
  // ping anyone until it's actually live. If you want future-scheduled
  // rotations to notify at their startDate automatically, that needs a
  // cron job; this covers the "admin creates it and it's live today" case.
  const now = new Date();
  if (input.startDate <= now) {
    const users = await prisma.user.findMany({ select: { id: true } });
    await prisma.notification.createMany({
      data: users.map(u => ({
        userId: u.id,
        type: 'ROTATION_OPENING' as const,
        rotationId: rotation.id,
      })),
    });
  }

  revalidatePath('/admin/rotations');
  revalidatePath('/dashboard/rotations');
  return { success: true, rotationId: rotation.id };
}

// ──────────────────────────────
// Close
// ──────────────────────────────

export async function closeRotation(rotationId: string): Promise<ActionResult> {
  const allowed = await requirePermission({ album: ['finalize'] });
  if (!allowed) throw new Error('Unauthorized');

  const rotation = await prisma.rotation.findUnique({
    where: { id: rotationId },
    include: { albums: { select: { albumId: true, closedAt: true } } },
  });
  if (!rotation) return { success: false, error: 'Rotation not found.' };

  const openAlbums = rotation.albums.filter(ra => ra.closedAt === null);
  if (openAlbums.length === 0) {
    return { success: false, error: 'This rotation is already closed.' };
  }

  const closedAt = new Date();

  await prisma.$transaction(async tx => {
    for (const ra of openAlbums) {
      const agg = await tx.rating.aggregate({
        where: { albumId: ra.albumId },
        _avg: { score: true },
        _count: { score: true },
      });
      const ratingCount = agg._count.score;
      const averageRating = ratingCount > 0 ? agg._avg.score : null;

      await tx.rotationAlbum.update({
        where: { rotationId_albumId: { rotationId, albumId: ra.albumId } },
        data: { averageRating, ratingCount, closedAt },
      });
      await tx.album.update({
        where: { id: ra.albumId },
        data: { averageRating, ratingCount },
      });
    }
  });

  // Notify everyone who rated at least one album in this rotation — not
  // a blanket "all users" blast like ROTATION_OPENING, since only raters
  // have a stake in "your scores are now public."
  const raters = await prisma.rating.findMany({
    where: { albumId: { in: openAlbums.map(a => a.albumId) } },
    select: { userId: true },
    distinct: ['userId'],
  });
  await prisma.notification.createMany({
    data: raters.map(r => ({
      userId: r.userId,
      type: 'ROTATION_CLOSED' as const,
      rotationId,
    })),
  });

  revalidatePath('/admin/rotations');
  revalidatePath('/dashboard/rotations');
  revalidatePath('/dashboard/albums');
  return { success: true };
}

// ──────────────────────────────
// Reminder
// ──────────────────────────────

export async function sendRotationReminder(
  rotationId: string
): Promise<ActionResult> {
  const allowed = await requirePermission({ album: ['manageRotation'] });
  if (!allowed) throw new Error('Unauthorized');

  const rotation = await prisma.rotation.findUnique({
    where: { id: rotationId },
    select: {
      id: true,
      endDate: true,
      albums: { select: { albumId: true, closedAt: true } },
    },
  });
  if (!rotation) return { success: false, error: 'Rotation not found.' };
  if (rotation.endDate < new Date()) {
    return { success: false, error: 'This rotation has already ended.' };
  }

  const albumIds = rotation.albums
    .filter(ra => ra.closedAt === null)
    .map(a => a.albumId);

  // Remind people who HAVEN'T finished — everyone, minus users who've
  // already rated every open album in this rotation. Simpler v1: remind
  // everyone who hasn't rated ALL of them (partial raters included,
  // since "rated 2 of 5" still means 3 unrated).
  const allUsers = await prisma.user.findMany({ select: { id: true } });
  const completedRatings = await prisma.rating.groupBy({
    by: ['userId'],
    where: { albumId: { in: albumIds } },
    _count: { albumId: true },
  });
  const completedUserIds = new Set(
    completedRatings
      .filter(c => c._count.albumId >= albumIds.length)
      .map(c => c.userId)
  );
  const targets = allUsers.filter(u => !completedUserIds.has(u.id));

  await prisma.notification.createMany({
    data: targets.map(u => ({
      userId: u.id,
      type: 'ROTATION_CLOSING_SOON' as const,
      rotationId,
    })),
  });

  return { success: true };
}

type EditRotationInput = {
  rotationId: string;
  name: string;
  slug?: string | null;
  startDate: Date;
  endDate: Date;
};

export async function editRotation(
  input: EditRotationInput
): Promise<ActionResult> {
  const allowed = await requirePermission({ album: ['manageRotation'] });
  if (!allowed) throw new Error('Unauthorized');

  if (input.endDate <= input.startDate) {
    return { success: false, error: 'End date must be after start date.' };
  }

  const overlapping = await prisma.rotation.findFirst({
    where: {
      id: { not: input.rotationId },
      startDate: { lte: input.endDate },
      endDate: { gte: input.startDate },
    },
    select: { id: true, name: true },
  });
  if (overlapping) {
    return {
      success: false,
      error: `Overlaps with an existing rotation: "${overlapping.name}".`,
    };
  }

  await prisma.rotation.update({
    where: { id: input.rotationId },
    data: {
      name: input.name,
      slug: input.slug || null,
      startDate: input.startDate,
      endDate: input.endDate,
    },
  });

  revalidatePath('/admin/rotations');
  revalidatePath('/dashboard/rotations');
  return { success: true };
}

export async function deleteRotation(
  rotationId: string
): Promise<ActionResult> {
  const allowed = await requirePermission({ album: ['manageRotation'] });
  if (!allowed) throw new Error('Unauthorized');

  const rotation = await prisma.rotation.findUnique({
    where: { id: rotationId },
    include: { albums: { select: { closedAt: true } } },
  });
  if (!rotation) return { success: false, error: 'Rotation not found.' };

  // Deleting a rotation with closed albums would silently erase public
  // scoring history — RotationAlbum has onDelete: Cascade, so this isn't
  // just "unschedule a mistake," it's "erase a public record." Block it;
  // only rotations that never closed anything are safe to delete outright.
  const hasClosedAlbums = rotation.albums.some(a => a.closedAt !== null);
  if (hasClosedAlbums) {
    return {
      success: false,
      error:
        "This rotation has closed albums with public scores — it can't be deleted.",
    };
  }

  await prisma.rotation.delete({ where: { id: rotationId } });

  revalidatePath('/admin/rotations');
  revalidatePath('/dashboard/rotations');
  return { success: true };
}

export async function addAlbumsToRotation(
  rotationId: string,
  albumIds: string[]
): Promise<ActionResult> {
  const allowed = await requirePermission({ album: ['manageRotation'] });
  if (!allowed) throw new Error('Unauthorized');

  if (albumIds.length === 0) {
    return { success: false, error: 'Select at least one album.' };
  }

  await prisma.rotationAlbum.createMany({
    data: albumIds.map(albumId => ({ rotationId, albumId })),
    skipDuplicates: true,
  });

  revalidatePath('/admin/rotations');
  revalidatePath('/dashboard/rotations');
  return { success: true };
}

export async function searchAlbumsForRotationAction(query: string) {
  const allowed = await requirePermission({ album: ['manageRotation'] });
  if (!allowed) throw new Error('Unauthorized');
  return searchAlbumsForRotation(query);
}
