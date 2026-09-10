import { prisma } from '@/lib/prisma';

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({ where: { userId, read: false } });
}

export async function getRecentNotifications(userId: string, limit = 10) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      actor: { select: { id: true, username: true, image: true } },
      album: { select: { id: true, title: true, slug: true } },
      rotation: { select: { id: true, name: true, slug: true } },
    },
  });
}

export type NotificationWithRelations = Awaited<
  ReturnType<typeof getRecentNotifications>
>[number];
