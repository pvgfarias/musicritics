import { prisma } from '@/lib/prisma';
import { Prisma } from '@/app/generated/prisma/client';
import { getFollowCounts, isFollowing } from '@/features/follows/queries';

const NO_USER = '__no_user__';

export type AdminUserSummary = {
  id: string;
  username: string;
  displayUsername: string | null;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  ratingCount: number;
  // Better-auth doesn't track a dedicated "last login" field — this is
  // derived from the user's most recent session (createdAt of the newest
  // row in Session). Good enough as an approximation for the admin panel;
  // null means the user has no session at all (never signed in, or every
  // session has expired and been cleaned up).
  lastLoginAt: Date | null;
};

export async function getUsersPage({
  page,
  pageSize,
  query,
}: {
  page: number;
  pageSize: number;
  query?: string;
}): Promise<{
  users: AdminUserSummary[];
  totalPages: number;
  totalUsers: number;
}> {
  const where: Prisma.UserWhereInput = query
    ? {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      }
    : {};

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        username: true,
        displayUsername: true,
        name: true,
        email: true,
        image: true,
        role: true,
        banned: true,
        banReason: true,
        banExpires: true,
        createdAt: true,
        _count: { select: { ratings: true } },
        sessions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { createdAt: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: users.map(u => {
      const { _count, sessions, ...rest } = u;
      return {
        ...rest,
        role: rest.role ?? 'user',
        banned: rest.banned ?? false,
        ratingCount: _count.ratings,
        lastLoginAt: sessions[0]?.createdAt ?? null,
      };
    }),
    totalPages: Math.max(1, Math.ceil(totalUsers / pageSize)),
    totalUsers,
  };
}

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
