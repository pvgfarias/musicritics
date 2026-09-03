// lib/sidebar-links.ts
import {
  IconHome,
  IconDisc,
  IconStar,
  IconRefresh,
  IconMicrophone2,
  IconUser,
  IconDeviceImacCog,
} from '@tabler/icons-react';
import type { SidebarLink } from './sidebar-links';

export const userLinks: SidebarLink[] = [
  { name: 'Home', href: '/dashboard', icon: IconHome, exact: true },
  { name: 'Artists', href: '/dashboard/artists', icon: IconMicrophone2 },
  { name: 'Albums', href: '/dashboard/albums', icon: IconDisc },
  { name: 'Rotations', href: '/dashboard/rotations', icon: IconRefresh },
  { name: 'Ratings', href: '/dashboard/ratings', icon: IconStar },
];

export const adminLinks: SidebarLink[] = [
  { name: 'Dashboard', href: '/admin', icon: IconDeviceImacCog, exact: true },
  { name: 'Manage Artists', href: '/admin/artists', icon: IconMicrophone2 },
  { name: 'Manage Albums', href: '/admin/albums', icon: IconDisc },
  { name: 'Manage Rotations', href: '/admin/rotations', icon: IconRefresh },
];

// separate array since only admin (not moderator) should see it
export const adminOnlyLinks: SidebarLink[] = [
  { name: 'Manage Users', href: '/admin/users', icon: IconUser },
];
