// lib/sidebar-links.ts
import {
  IconHome,
  IconDisc,
  IconStar,
  IconPlaylist,
  IconMicrophone2,
  IconUser,
  IconDeviceImacCog,
} from '@tabler/icons-react';
import type { SidebarLink } from '@/components/layout/sidebar/sidebar-links';

export const userLinks: SidebarLink[] = [
  { name: 'Home', href: '/dashboard', icon: IconHome, exact: true },
  { name: 'Artists', href: '/dashboard/artists', icon: IconMicrophone2 },
  { name: 'Albums', href: '/dashboard/albums', icon: IconDisc },
  { name: 'Songs', href: '/dashboard/songs', icon: IconPlaylist },
  { name: 'Ratings', href: '/dashboard/ratings', icon: IconStar },
];

export const adminLinks: SidebarLink[] = [
  { name: 'Dashboard', href: '/admin', icon: IconDeviceImacCog, exact: true },
  { name: 'Manage Artists', href: '/admin/artists', icon: IconMicrophone2 },
  { name: 'Manage Albums', href: '/admin/albums', icon: IconDisc },
  { name: 'Manage Songs', href: '/admin/songs', icon: IconPlaylist },
];

// separate array since only admin (not moderator) should see it
export const adminOnlyLinks: SidebarLink[] = [
  { name: 'Manage Users', href: '/admin/users', icon: IconUser },
];
