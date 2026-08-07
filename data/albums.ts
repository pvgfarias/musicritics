// data/albums.ts
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type AlbumWithRelations = Prisma.AlbumGetPayload<{
  include: {
    artists: {
      include: {
        artist: {
          select: { id: true; name: true; slug: true; image: true };
        };
      };
    };
    tracks: {
      include: {
        ratings: {
          select: { score: true };
        };
      };
    };
    ratings: {
      include: {
        user: { select: { id: true; username: true; image: true } };
      };
    };
    socialLinks: true;
  };
}>;

function normalizeAlbum(album: AlbumWithRelations) {
  const artistNames = album.artists
    .map(entry => entry.artist.name)
    .filter(Boolean);

  return {
    ...album,
    artist: artistNames.join(', '),
    artistNames,
    tracklist: album.tracks.map((track: { title: string }) => track.title),
  };
}

export async function getAllAlbums() {
  const albums = await prisma.album.findMany({
    include: {
      artists: {
        include: {
          artist: {
            select: { id: true, name: true, slug: true, image: true },
          },
        },
      },
      tracks: {
        orderBy: { number: 'asc' },
        include: {
          ratings: {
            select: { score: true },
          },
        },
      },
      ratings: {
        include: {
          user: { select: { id: true, username: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      socialLinks: {
        orderBy: { platform: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return albums.map(normalizeAlbum);
}

export async function getAlbumBySlug(slug: string) {
  const album = await prisma.album.findUnique({
    where: { slug },
    include: {
      artists: {
        include: {
          artist: {
            select: { id: true, name: true, slug: true, image: true },
          },
        },
      },
      tracks: {
        orderBy: { number: 'asc' },
        include: {
          ratings: {
            select: { score: true },
          },
        },
      },
      ratings: {
        include: {
          user: { select: { id: true, username: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      socialLinks: {
        orderBy: { platform: 'asc' },
      },
    },
  });

  if (!album) return null;
  return normalizeAlbum(album);
}

export async function getAlbumsByArtist(artistId: string) {
  const albums = await prisma.album.findMany({
    where: {
      artists: {
        some: { artistId },
      },
    },
    include: {
      artists: {
        include: {
          artist: {
            select: { id: true, name: true, slug: true, image: true },
          },
        },
      },
      tracks: {
        orderBy: { number: 'asc' },
        include: {
          ratings: {
            select: { score: true },
          },
        },
      },
      ratings: {
        include: {
          user: { select: { id: true, username: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      socialLinks: {
        orderBy: { platform: 'asc' },
      },
    },
    orderBy: { releaseYear: 'desc' },
  });

  return albums.map(normalizeAlbum);
}

export async function getAlbumWithAverageRating(slug: string) {
  const album = await getAlbumBySlug(slug);
  if (!album) return null;

  const trackScores = (
    album.tracks as Array<{ ratings: Array<{ score: number | null }> }>
  ).flatMap(track =>
    track.ratings
      .map(rating => rating.score)
      .filter((score): score is number => score != null)
  );

  const albumScores = (
    album.ratings as Array<{ score: number | null }>
  ).flatMap(rating => (rating.score == null ? [] : [rating.score]));

  const allScores = [...trackScores, ...albumScores];
  const avg =
    allScores.length > 0
      ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
      : null;

  return {
    ...album,
    averageRating: avg,
    ratingCount: album.ratings.length,
  };
}
