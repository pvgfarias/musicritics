import { prisma } from '@/lib/prisma';

export type AlbumTrackForRating = Awaited<
  ReturnType<typeof getAlbumTracksForRating>
>[number];

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
