import { prisma } from '@/lib/prisma';

export async function isFollowing(followerId: string, followingId: string) {
  if (!followerId) return false;
  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
    select: { id: true },
  });
  return !!follow;
}

export async function getFollowCounts(userId: string) {
  const [followers, following] = await Promise.all([
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);
  return { followers, following };
}

export async function getFollowers(userId: string) {
  const rows = await prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: { id: true, username: true, image: true, bio: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(r => r.follower);
}

export async function getFollowing(userId: string) {
  const rows = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: { id: true, username: true, image: true, bio: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(r => r.following);
}

export async function getFollowingFeed(userId: string, limit = 20) {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map(f => f.followingId);

  if (followingIds.length === 0) return [];

  const now = new Date();
  return prisma.rating.findMany({
    where: {
      userId: { in: followingIds },
      // Same "public once rotation closes" rule as everywhere else —
      // don't leak an in-progress rating to followers early.
      album: {
        rotations: {
          none: {
            closedAt: null,
            rotation: { startDate: { lte: now }, endDate: { gte: now } },
          },
        },
      },
    },
    orderBy: { ratedAt: 'desc' },
    take: limit,
    include: {
      user: { select: { id: true, username: true, image: true } },
      album: {
        select: { id: true, title: true, slug: true, coverImage: true },
      },
      comment: { select: { body: true } },
    },
  });
}

// For the empty state — a small pool of people to follow when you're not
// following anyone yet. Simplest possible version: most recently joined
// users, excluding yourself. Nothing clever (no "mutuals" or activity
// ranking) — good enough to unblock the empty state without needing a
// full user-browse page first.
export async function getSuggestedUsers(excludeUserId: string, limit = 6) {
  return prisma.user.findMany({
    where: { id: { not: excludeUserId } },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: { id: true, username: true, image: true, bio: true },
  });
}

// Site-wide activity, not scoped to who the viewer follows — same
// "public once rotation closes" privacy rule as getFollowingFeed, since
// this is just that same rule applied to every user instead of a filtered
// set of them. Excludes the viewer's own ratings: seeing your own activity
// in a "what's everyone else up to" rail isn't useful.
export async function getGlobalFeed(viewerId?: string, limit = 15) {
  const now = new Date();
  return prisma.rating.findMany({
    where: {
      ...(viewerId && { userId: { not: viewerId } }),
      album: {
        rotations: {
          none: {
            closedAt: null,
            rotation: { startDate: { lte: now }, endDate: { gte: now } },
          },
        },
      },
    },
    orderBy: { ratedAt: 'desc' },
    take: limit,
    include: {
      user: { select: { id: true, username: true, image: true } },
      album: {
        select: { id: true, title: true, slug: true, coverImage: true },
      },
      comment: { select: { body: true } },
    },
  });
}
