import { Prisma } from '@/app/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { isAlbumOpenForRatings } from '@/features/albums/queries';

type TrackWithRelations = Prisma.TrackGetPayload<{
  include: {
    album: {
      select: {
        id: true;
        title: true;
        slug: true;
        coverImage: true;
        artists: {
          include: {
            artist: { select: { id: true; name: true; slug: true } };
          };
        };
      };
    };
    ratings: {
      include: {
        user: { select: { id: true; username: true; image: true } };
        comment: {
          include: {
            author: { select: { id: true; username: true; image: true } };
          };
        };
      };
    };
  };
}>;

const trackSummarySelect = {
  id: true,
  title: true,
  number: true,
  createdAt: true,
  albumId: true,
  _count: { select: { ratings: true } },
  ratings: { select: { score: true } },
} satisfies Prisma.TrackSelect;

type TrackSummaryRaw = Prisma.TrackGetPayload<{
  select: typeof trackSummarySelect;
}>;

export type TrackFull = Awaited<ReturnType<typeof getTrackWithAverageRating>>;

export type TrackSummary = TrackSummaryRaw & {
  ratingCount: number;
  averageRating: number | null;
};

// A track accepts ratings exactly when its parent album does — there's no
// separate rotation concept for tracks, so this just delegates to the same
// RotationAlbum lookup used everywhere else. Now async (was a synchronous
// boolean read before).
export async function isTrackOpenForRatings(albumId: string) {
  return isAlbumOpenForRatings(albumId);
}

function normalizeTrack(track: TrackWithRelations) {
  const artistNames = track.album.artists
    .map(entry => entry.artist.name)
    .filter(Boolean);

  return {
    ...track,
    album: {
      ...track.album,
      artist: artistNames.join(', '),
      artistNames,
    },
  };
}

function normalizeTrackSummary(track: TrackSummaryRaw) {
  const scores = track.ratings
    .map(rating => rating.score)
    .filter((score): score is number => score != null);

  const averageRating = scores.length
    ? scores.reduce((sum, score) => sum + score, 0) / scores.length
    : null;

  return {
    ...track,
    ratingCount: track._count.ratings,
    averageRating,
  };
}

export async function getTracksByAlbumId(albumId: string) {
  const tracks = await prisma.track.findMany({
    where: { albumId },
    select: trackSummarySelect,
    orderBy: { number: 'asc' },
  });

  return tracks.map(normalizeTrackSummary);
}

export async function getTrackById(id: string) {
  const track = await prisma.track.findUnique({
    where: { id },
    include: {
      album: {
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          artists: {
            include: {
              artist: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      },
      ratings: {
        include: {
          user: { select: { id: true, username: true, image: true } },
          comment: {
            include: {
              author: { select: { id: true, username: true, image: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!track) return null;
  return normalizeTrack(track);
}

export async function getTrackWithAverageRating(id: string) {
  const track = await getTrackById(id);
  if (!track) return null;

  const scores = track.ratings.flatMap(rating =>
    rating.score == null ? [] : [rating.score]
  );

  const averageRating = scores.length
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : null;

  return {
    ...track,
    averageRating,
    ratingCount: track.ratings.length,
    openForRatings: await isTrackOpenForRatings(track.album.id),
  };
}
