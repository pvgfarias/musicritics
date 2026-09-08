'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/features/auth/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@/app/generated/prisma/client';

export type TrackRatingInput = {
  trackId: string;
  score: number | null;
  comment: string;
};

export type SaveAlbumRatingInput = {
  albumId: string;
  albumSlug: string;
  albumComment: string;
  trackRatings: TrackRatingInput[];
};

async function syncComment(
  tx: Prisma.TransactionClient,
  {
    ratingId,
    trackRatingId,
    body,
    authorId,
  }: {
    ratingId?: string;
    trackRatingId?: string;
    body: string;
    authorId: string;
  }
) {
  const trimmed = body.trim();
  const where = ratingId ? { ratingId } : { trackRatingId: trackRatingId! };

  const existing = await tx.comment.findUnique({ where });

  if (!trimmed) {
    if (existing) await tx.comment.delete({ where: { id: existing.id } });
    return;
  }

  if (existing) {
    await tx.comment.update({
      where: { id: existing.id },
      data: { body: trimmed },
    });
  } else {
    await tx.comment.create({
      data: {
        body: trimmed,
        authorId,
        ...(ratingId ? { ratingId } : { trackRatingId }),
      },
    });
  }
}

export async function saveAlbumRating({
  albumId,
  albumSlug,
  albumComment,
  trackRatings,
}: SaveAlbumRatingInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) throw new Error('You must be signed in to rate an album.');

  // Writing ratings is still gated on the album currently being in an
  // active, unclosed rotation — that hasn't changed. What HAS changed is
  // that this no longer determines Rating's identity; it's purely a
  // "can this form submit right now" check.
  const now = new Date();
  const activeRotationAlbum = await prisma.rotationAlbum.findFirst({
    where: {
      albumId,
      closedAt: null,
      rotation: { startDate: { lte: now }, endDate: { gte: now } },
    },
    select: { rotationId: true },
  });

  if (!activeRotationAlbum) {
    throw new Error('This album is not currently open for ratings.');
  }

  await prisma.$transaction(async tx => {
    // Track ratings first — Rating is derived from these, not the other
    // way around. Not rotation-scoped (schema-wise), but writing them is
    // still gated by the same "album is open" check above, since they're
    // part of the same rate-this-album flow.
    const trackRatingResults = await Promise.all(
      trackRatings.map(t =>
        tx.trackRating.upsert({
          where: { userId_trackId: { userId, trackId: t.trackId } },
          create: { userId, trackId: t.trackId, score: t.score },
          update: { score: t.score },
        })
      )
    );

    const trackRatingIds = trackRatingResults.map(tr => tr.id);

    const existingComments = await tx.comment.findMany({
      where: { trackRatingId: { in: trackRatingIds } },
    });
    const commentByTrackRatingId = new Map(
      existingComments.map(c => [c.trackRatingId, c])
    );

    const toDelete: string[] = [];
    const toUpdate: { id: string; body: string }[] = [];
    const toCreate: { trackRatingId: string; body: string }[] = [];

    for (const tr of trackRatingResults) {
      const input = trackRatings.find(t => t.trackId === tr.trackId)!;
      const trimmed = input.comment.trim();
      const existing = commentByTrackRatingId.get(tr.id);

      if (!trimmed) {
        if (existing) toDelete.push(existing.id);
      } else if (existing) {
        toUpdate.push({ id: existing.id, body: trimmed });
      } else {
        toCreate.push({ trackRatingId: tr.id, body: trimmed });
      }
    }

    await Promise.all([
      toDelete.length &&
        tx.comment.deleteMany({ where: { id: { in: toDelete } } }),
      ...toUpdate.map(u =>
        tx.comment.update({ where: { id: u.id }, data: { body: u.body } })
      ),
      toCreate.length &&
        tx.comment.createMany({
          data: toCreate.map(c => ({
            trackRatingId: c.trackRatingId,
            body: c.body,
            authorId: userId,
          })),
        }),
    ]);

    // Recompute the derived album score from EVERY track rating this user
    // has for this album in the DB — not just the ones in this submission.
    // Rating is now permanent per (userId, albumId), so it must reflect
    // the user's full track-rating history for the album, not one save's
    // payload.
    const allUserTrackRatings = await tx.trackRating.findMany({
      where: { userId, track: { albumId } },
      select: { score: true },
    });
    const scores = allUserTrackRatings
      .map(r => r.score)
      .filter((s): s is number => s !== null);

    const albumScore = scores.length
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : null;

    if (albumScore === null) {
      // No rated tracks left for this album — nothing to derive a score
      // from, so there's no Rating (and no comment) to keep either.
      await tx.rating.deleteMany({ where: { userId, albumId } });
      return;
    }

    const rating = await tx.rating.upsert({
      where: { userId_albumId: { userId, albumId } },
      create: { userId, albumId, score: albumScore },
      update: { score: albumScore, ratedAt: new Date() },
    });

    // Deliberately no Album.averageRating recompute here — the public
    // score only updates when the rotation-close job runs (see
    // closeRotationForAlbum / mutations.ts).

    await syncComment(tx, {
      ratingId: rating.id,
      body: albumComment,
      authorId: userId,
    });
  });

  revalidatePath(`/albums/${albumSlug}`);
}
