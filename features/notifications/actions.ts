'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/features/auth/auth';
import { headers } from 'next/headers';
import { getUnreadNotificationCount, getRecentNotifications } from './queries';

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) throw new Error('You must be signed in.');
  return userId;
}

// Single round trip for the bell: badge count + dropdown contents together,
// since they're always needed at roughly the same time.
export async function getNotificationBellData() {
  const userId = await requireUserId();
  const [unreadCount, notifications] = await Promise.all([
    getUnreadNotificationCount(userId),
    getRecentNotifications(userId),
  ]);
  return { unreadCount, notifications };
}

export async function markNotificationRead(notificationId: string) {
  const userId = await requireUserId();
  // Scoped by userId too — makes sure someone can't mark another user's
  // notification as read by guessing an id.
  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
}

export async function markAllNotificationsRead() {
  const userId = await requireUserId();
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}
