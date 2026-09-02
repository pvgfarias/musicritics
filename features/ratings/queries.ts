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

// New: the rating form needs to know (a) whether it should render at all,
// and (b) which rotation a save will apply to / when ratings close. Returns
// null if the album isn't currently open for ratings.
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

// New: fetch the current user's own album-level rating for this cycle, so
// the form can be pre-filled when editing an existing rating.
export async function getUserAlbumRatingForActiveRotation(
  albumId: string,
  userId: string
) {
  const activeRotation = await getActiveRotationForAlbum(albumId);
  if (!activeRotation) return null;

  return prisma.rating.findUnique({
    where: {
      userId_albumId_rotationId: {
        userId,
        albumId,
        rotationId: activeRotation.id,
      },
    },
    include: { comment: true },
  });
}
