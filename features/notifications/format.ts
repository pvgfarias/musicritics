import type { NotificationWithRelations } from './queries';

export function formatNotification(n: NotificationWithRelations): {
  text: string;
  href: string | null;
} {
  switch (n.type) {
    case 'NEW_FOLLOWER':
      return {
        text: `${n.actor?.username ?? 'Someone'} started following you`,
        href: n.actor ? `/users/${n.actor.username}` : null,
      };
    case 'ROTATION_OPENING':
      return {
        text: `${n.rotation?.name ?? 'A rotation'} is now open for ratings`,
        href: n.rotation ? `/dashboard/rotations` : null,
      };
    case 'ROTATION_CLOSING_SOON':
      return {
        text: `${n.rotation?.name ?? 'The current rotation'} closes soon`,
        href: n.rotation ? `/dashboard/rotations` : null,
      };
    case 'ROTATION_CLOSED':
      return {
        text: `${n.rotation?.name ?? 'A rotation'} has closed — scores are public`,
        href: n.rotation ? `/dashboard/rotations` : null,
      };
    default:
      return { text: 'New notification', href: null };
  }
}
