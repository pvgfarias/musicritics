import { prisma } from '@/lib/prisma';

export type AlbumTrackForRating = Awaited<
  ReturnType<typeof getAlbumTracksForRating>
>[number];

// TrackRating is NOT rotation-scoped (by design — see actions.ts), so this
// unique key and shape are unchanged from before the rotation feature.
export async function getUserTrackRating(trackId: string, userId: string) {
  return prisma.trackRating.findUnique({
    where: { userId_trackId: { userId, trackId } },
    include: { comment: true },
  });
}

export async function getAlbumTracksForRating(albumId: string, userId: string) {
  const tracks = await prisma.track.findMany({
    where: { albumId },
    orderBy: { number: 'asc' },
    select: {
      id: true,
      title: true,
      number: true,
      ratings: {
        where: { userId },
        select: {
          score: true,
          comment: { select: { body: true } },
        },
      },
    },
  });

  return tracks.map(track => {
    const existing = track.ratings[0] ?? null;

    return {
      id: track.id,
      title: track.title,
      number: track.number,
      score: existing?.score ?? null,
      comment: existing?.comment?.body ?? '',
    };
  });
}

// Whether the album currently accepts new/edited track ratings, and which
// rotation is driving that window. This is purely a "can the form submit
// right now" check — it has no bearing on whether a Rating exists, since
// Rating is no longer rotation-scoped. Returns null if the album isn't
// currently open for ratings.
export async function getActiveRotationForAlbum(albumId: string) {
  const now = new Date();

  const active = await prisma.rotationAlbum.findFirst({
    where: {
      albumId,
      closedAt: null,
      rotation: { startDate: { lte: now }, endDate: { gte: now } },
    },
    select: {
      rotation: { select: { id: true, name: true, endDate: true } },
    },
  });

  return active?.rotation ?? null;
}

// Fetch the current user's album-level rating (derived from their track
// ratings), regardless of which rotation — if any — is currently active.
// Rating is keyed only on (userId, albumId) now: a user rates an album
// once, period, and that rating persists across every rotation the album
// ever appears in. Used both to pre-fill the form when editing, and to
// drive the "you've already rated this" flag independent of whether the
// album happens to be in an open rotation right now.
export async function getUserAlbumRating(albumId: string, userId: string) {
  return prisma.rating.findUnique({
    where: { userId_albumId: { userId, albumId } },
    include: { comment: true },
  });
}
