'use client';
import {
  IconHome,
  IconUser,
  IconDisc,
  IconStar,
  IconPlaylist,
  IconMicrophone2,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Home', href: '/dashboard', icon: IconHome },
  {
    name: 'Profile',
    href: '/profile',
    icon: IconUser,
  },
  { name: 'Artists', href: '/dashboard/artists', icon: IconMicrophone2 },
  { name: 'Albums', href: '/dashboard/albums', icon: IconDisc },
  { name: 'Songs', href: '/dashboard/songs', icon: IconPlaylist },
  { name: 'Ratings', href: '/dashboard/ratings', icon: IconStar },
];

export default function SidebarLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map(link => {
        const LinkIcon = link.icon;
        const isCurrentPath = pathname === link.href;
        return (
          <div
            key={link.name}
            className={
              isCurrentPath
                ? 'bg-amber-950 text-white border-l-4 border-amber-600 rounded-sm'
                : ''
            }
          >
            <Link
              href={link.href}
              className='flex flex-row justify-center items-center gap-3 p-3 text-xs font-mono uppercase tracking-wide md:flex-none md:justify-start md:p-2 md:px-3 hover:text-amber-600 cursor-pointer hover:translate-x-2 transition-all duration-200'
            >
              <LinkIcon size={24} />
              <p className='hidden md:block'>{link.name}</p>
            </Link>
          </div>
        );
      })}
    </>
  );
}
