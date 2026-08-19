// data/tracks.ts
import { Prisma } from '../app/generated/prisma/client';
import { prisma } from '@/lib/prisma';

type TrackWithRelations = Prisma.TrackGetPayload<{
  include: {
    album: {
      select: {
        id: true;
        title: true;
        slug: true;
        coverImage: true;
        finalized: true;
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

export type AlbumTrackForRating = Awaited<
  ReturnType<typeof getAlbumTracksForRating>
>[number];

// A track accepts new ratings from users as long as its album hasn't been finalized.
export function isTrackOpenForRatings(track: {
  album: { finalized: boolean };
}) {
  return !track.album.finalized;
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
          finalized: true,
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
    openForRatings: isTrackOpenForRatings(track),
  };
}

// Fetches the current user's existing score + comment for a single track,
// e.g. to prefill a rating widget when a track is opened on its own.
export async function getUserTrackRating(trackId: string, userId: string) {
  return prisma.trackRating.findUnique({
    where: { userId_trackId: { userId, trackId } },
    include: { comment: true },
  });
}

// Fetches every track on an album alongside the given user's existing
// score + comment for each one (or null if they haven't rated it yet).
// Built for the album rating dialog, so each slider/comment box can be
// prefilled with the user's prior rating.
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
