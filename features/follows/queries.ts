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
