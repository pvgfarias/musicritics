// app/actions/rate-album.ts
'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
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

    await syncComment(tx, {
      ratingId: rating.id,
      body: albumComment,
      authorId: userId,
    });

    for (const t of trackRatings) {
      const trackRating = await tx.trackRating.upsert({
        where: { userId_trackId: { userId, trackId: t.trackId } },
        create: { userId, trackId: t.trackId, score: t.score },
        update: { score: t.score },
      });

      await syncComment(tx, {
        trackRatingId: trackRating.id,
        body: t.comment,
        authorId: userId,
      });
    }
  });

  revalidatePath(`/albums/${albumSlug}`);
}
