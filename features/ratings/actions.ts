'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/features/auth/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@/app/generated/prisma/client';
import { recomputeAlbumAggregate } from './mutations';

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

  const ratedScores = trackRatings
    .map(t => t.score)
    .filter((s): s is number => s !== null);

  const albumScore = ratedScores.length
    ? Math.round(ratedScores.reduce((a, b) => a + b, 0) / ratedScores.length)
    : null;

  await prisma.$transaction(async tx => {
    const rating = await tx.rating.upsert({
      where: { userId_albumId: { userId, albumId } },
      create: { userId, albumId, score: albumScore },
      update: { score: albumScore },
    });

    await recomputeAlbumAggregate(tx, albumId); // ← the fix

    await syncComment(tx, {
      ratingId: rating.id,
      body: albumComment,
      authorId: userId,
    });

    // Upserts still need to happen per-row (no upsertMany in Prisma),
    // but we can at least fire them without the extra findUnique each time
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

    // 1 round trip: fetch existing comments for all trackRatings at once
    const existingComments = await tx.comment.findMany({
      where: { trackRatingId: { in: trackRatingIds } },
    });
    const commentByTrackRatingId = new Map(
      existingComments.map(c => [c.trackRatingId, c])
    );

    // Batch comment writes by operation type instead of one-by-one find+branch
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
  });

  revalidatePath(`/albums/${albumSlug}`);
}
