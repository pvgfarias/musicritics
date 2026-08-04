'use client';
import {
  IconHome,
  IconDisc,
  IconStar,
  IconPlaylist,
  IconMicrophone2,
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import SidebarItem from './sidebar-item';

const links = [
  { name: 'Home', href: '/dashboard', icon: IconHome },
  { name: 'Artists', href: '/dashboard/artists', icon: IconMicrophone2 },
  { name: 'Albums', href: '/dashboard/albums', icon: IconDisc },
  { name: 'Songs', href: '/dashboard/songs', icon: IconPlaylist },
  { name: 'Ratings', href: '/dashboard/ratings', icon: IconStar },
];
export default function SidebarLinks() {
  const pathname = usePathname();

  return (
    <div className='flex flex-col gap-1 w-full'>
      {links.map(link => {
        const LinkIcon = link.icon;
        const isCurrentPath =
          pathname === link.href ||
          (pathname.startsWith(link.href + '/') && link.name !== 'Home');
        return (
          <SidebarItem
            key={link.name}
            href={link.href}
            icon={LinkIcon}
            label={link.name}
            isActive={isCurrentPath}
          />
        );
      })}
    </div>
  );
}
