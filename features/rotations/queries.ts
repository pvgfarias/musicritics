import { Prisma } from '../../app/generated/prisma/client';
import { prisma } from '@/lib/prisma';

// --- Active rotation ---------------------------------------------------
// The current, still-open cycle. Never exposes averageRating/ratingCount —
// those stay null on every RotationAlbum until the close job runs, and
// showing a live in-progress average would defeat the point of the
// "scores go public only at close" rule. What it does expose is the
// viewer's own rating per album, since that's private to them anyway.

export type ActiveRotation = Awaited<ReturnType<typeof getActiveRotation>>;
export type ActiveRotationAlbum = Exclude<
  ActiveRotation,
  null
>['albums'][number];

export async function getActiveRotation(userId?: string) {
  const now = new Date();

  const rotation = await prisma.rotation.findFirst({
    where: { startDate: { lte: now }, endDate: { gte: now } },
    include: {
      albums: {
        include: {
          album: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverImage: true,
              artists: {
                select: {
                  artist: { select: { id: true, name: true, slug: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!rotation) return null;

  // Fetched separately rather than nested in the query above: Rating rows
  // for an album span every rotation it's ever been in, so this has to be
  // scoped to rotation.id explicitly or a re-entering album would leak an
  // old cycle's score as if it were this one's.
  const userRatings = userId
    ? await prisma.rating.findMany({
        where: { userId, rotationId: rotation.id },
        select: { albumId: true, score: true },
      })
    : [];
  const userScoreByAlbumId = new Map(
    userRatings.map(r => [r.albumId, r.score])
  );

  const albums = rotation.albums.map(ra => {
    const artistNames = ra.album.artists
      .map(a => a.artist.name)
      .filter(Boolean);
    return {
      id: ra.album.id,
      title: ra.album.title,
      slug: ra.album.slug,
      coverImage: ra.album.coverImage,
      artist: artistNames.join(', '),
      artistNames,
      userRating: userScoreByAlbumId.get(ra.album.id) ?? null,
    };
  });

  return {
    id: rotation.id,
    name: rotation.name,
    slug: rotation.slug,
    startDate: rotation.startDate,
    endDate: rotation.endDate,
    albumCount: albums.length,
    albums,
  };
}

// --- Past rotations (list) ----------------------------------------------
// Paginated browse of closed cycles, each with a small top-albums preview
// (by score) for a rotation-card UI.

export type RotationSummary = Awaited<
  ReturnType<typeof getRotationsPage>
>['rotations'][number];

type RotationsQuery = {
  page?: number;
  pageSize?: number;
};

export async function getRotationsPage({
  page = 1,
  pageSize = 12,
}: RotationsQuery = {}) {
  const now = new Date();
  const where: Prisma.RotationWhereInput = { endDate: { lt: now } };

  const [rotations, total] = await Promise.all([
    prisma.rotation.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { endDate: 'desc' },
      include: {
        albums: {
          where: { closedAt: { not: null } },
          orderBy: { averageRating: 'desc' },
          take: 3,
          include: {
            album: {
              select: { id: true, title: true, slug: true, coverImage: true },
            },
          },
        },
        _count: { select: { albums: true } },
      },
    }),
    prisma.rotation.count({ where }),
  ]);

  return {
    rotations: rotations.map(rotation => ({
      id: rotation.id,
      name: rotation.name,
      slug: rotation.slug,
      startDate: rotation.startDate,
      endDate: rotation.endDate,
      albumCount: rotation._count.albums,
      topAlbums: rotation.albums.map(ra => ({
        id: ra.album.id,
        title: ra.album.title,
        slug: ra.album.slug,
        coverImage: ra.album.coverImage,
        averageRating: ra.averageRating,
        ratingCount: ra.ratingCount,
      })),
    })),
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

// --- Single rotation detail ----------------------------------------------
// Works for ANY rotation, past or currently active — the per-album score
// only ever comes through if that specific RotationAlbum has actually
// closed (`closedAt` set), so pointing this at the live active rotation's
// slug is safe and just returns everything with averageRating: null.

export type RotationDetail = Awaited<ReturnType<typeof getRotationBySlug>>;
export type RotationDetailAlbum = Exclude<
  RotationDetail,
  null
>['albums'][number];

async function normalizeRotationDetail(
  rotation: Prisma.RotationGetPayload<{
    include: {
      albums: {
        include: {
          album: {
            select: {
              id: true;
              title: true;
              slug: true;
              coverImage: true;
              artists: {
                select: {
                  artist: { select: { id: true; name: true; slug: true } };
                };
              };
            };
          };
        };
      };
    };
  }>
) {
  const now = new Date();
  const isActive = rotation.startDate <= now && rotation.endDate >= now;

  const albums = rotation.albums
    .map(ra => {
      const artistNames = ra.album.artists
        .map(a => a.artist.name)
        .filter(Boolean);
      const isPublic = ra.closedAt !== null;

      return {
        id: ra.album.id,
        title: ra.album.title,
        slug: ra.album.slug,
        coverImage: ra.album.coverImage,
        artist: artistNames.join(', '),
        artistNames,
        averageRating: isPublic ? ra.averageRating : null,
        ratingCount: isPublic ? ra.ratingCount : null,
        isPublic,
      };
    })
    // Best score first when public; otherwise fall back to title so an
    // in-progress rotation doesn't render in a meaningless "sorted by
    // null" order.
    .sort((a, b) => {
      if (a.averageRating != null && b.averageRating != null) {
        return b.averageRating - a.averageRating;
      }
      if (a.averageRating != null) return -1;
      if (b.averageRating != null) return 1;
      return a.title.localeCompare(b.title);
    });

  return {
    id: rotation.id,
    name: rotation.name,
    slug: rotation.slug,
    startDate: rotation.startDate,
    endDate: rotation.endDate,
    isActive,
    albums,
  };
}

const rotationDetailInclude = {
  albums: {
    include: {
      album: {
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          artists: {
            select: {
              artist: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.RotationInclude;

export async function getRotationBySlug(slug: string) {
  const rotation = await prisma.rotation.findUnique({
    where: { slug },
    include: rotationDetailInclude,
  });

  if (!rotation) return null;
  return normalizeRotationDetail(rotation);
}

export async function getRotationById(id: string) {
  const rotation = await prisma.rotation.findUnique({
    where: { id },
    include: rotationDetailInclude,
  });

  if (!rotation) return null;
  return normalizeRotationDetail(rotation);
}
