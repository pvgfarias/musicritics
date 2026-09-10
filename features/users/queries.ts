import { prisma } from '@/lib/prisma';
import { getFollowCounts, isFollowing } from '@/features/follows/queries';

const NO_USER = '__no_user__';

export async function getUserProfileByUsername(
  username: string,
  viewerId?: string
) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayUsername: true,
      name: true,
      image: true,
      bio: true,
      country: true,
      createdAt: true,
      favoriteAlbums: {
        orderBy: { position: 'asc' },
        select: {
          position: true,
          album: {
            select: { id: true, title: true, slug: true, coverImage: true },
          },
        },
      },
      favoriteArtists: {
        orderBy: { position: 'asc' },
        select: {
          position: true,
          artist: { select: { id: true, name: true, slug: true, image: true } },
        },
      },
      _count: { select: { ratings: true } },
    },
  });

  if (!user) return null;

  const isOwnProfile = viewerId === user.id;

  // Reviews are only public once the album's rotation has closed — same
  // rule album-reviews.tsx uses. On your own profile you see everything,
  // including in-progress ratings; on someone else's, only closed ones.
  const now = new Date();
  const ratings = await prisma.rating.findMany({
    where: {
      userId: user.id,
      ...(isOwnProfile
        ? {}
        : {
            album: {
              rotations: {
                none: {
                  closedAt: null,
                  rotation: { startDate: { lte: now }, endDate: { gte: now } },
                },
              },
            },
          }),
    },
    orderBy: { ratedAt: 'desc' },
    take: 10,
    select: {
      id: true,
      score: true,
      ratedAt: true,
      comment: { select: { body: true } },
      album: {
        select: { id: true, title: true, slug: true, coverImage: true },
      },
    },
  });

  const [followCounts, viewerIsFollowing] = await Promise.all([
    getFollowCounts(user.id),
    viewerId ? isFollowing(viewerId, user.id) : Promise.resolve(false),
  ]);

  const { _count, favoriteAlbums, favoriteArtists, ...rest } = user;

  return {
    ...rest,
    ratingCount: _count.ratings,
    favoriteAlbums: favoriteAlbums.map(f => f.album),
    favoriteArtists: favoriteArtists.map(f => f.artist),
    recentRatings: ratings,
    followCounts,
    isOwnProfile,
    viewerIsFollowing,
  };
}

export type UserProfile = NonNullable<
  Awaited<ReturnType<typeof getUserProfileByUsername>>
>;
