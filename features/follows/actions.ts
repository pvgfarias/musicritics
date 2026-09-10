'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/features/auth/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getFollowers, getFollowing } from '@/features/follows/queries';

export async function getFollowersList(userId: string) {
  return getFollowers(userId);
}

export async function getFollowingList(userId: string) {
  return getFollowing(userId);
}

export async function followUser(targetUserId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) throw new Error('You must be signed in to follow users.');
  if (userId === targetUserId) throw new Error("You can't follow yourself.");

  const existed = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId: userId, followingId: targetUserId },
    },
    select: { id: true },
  });

  await prisma.follow.upsert({
    where: {
      followerId_followingId: { followerId: userId, followingId: targetUserId },
    },
    create: { followerId: userId, followingId: targetUserId },
    update: {},
  });

  // Only fire a notification on a genuinely new follow — not a repeat
  // click on an already-following state.
  if (!existed) {
    await prisma.notification.create({
      data: { userId: targetUserId, actorId: userId, type: 'NEW_FOLLOWER' },
    });
  }

  revalidatePath(`/users/${targetUserId}`);
}

export async function unfollowUser(targetUserId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) throw new Error('You must be signed in.');

  await prisma.follow.deleteMany({
    where: { followerId: userId, followingId: targetUserId },
  });

  revalidatePath(`/users/${targetUserId}`);
}
