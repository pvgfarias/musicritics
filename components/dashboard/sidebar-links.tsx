'use client';
import {
  IconHome,
  IconUser,
  IconDisc,
  IconMusic,
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
  { name: 'Songs', href: '/dashboard/songs', icon: IconMusic },
  { name: 'Ratings', href: '/dashboard/ratings', icon: IconPlaylist },
];

export default function SidebarLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map(link => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex h-12 grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 hover:text-amber-600 cursor-pointer transition-colors duration-200 ${pathname === link.href ? 'text-amber-600 bg-gray-100 dark:bg-slate-700' : 'text-gray-900 bg-white dark:bg-slate-800 dark:text-white'}`}
          >
            <LinkIcon className='w-6' />
            <p className='hidden md:block'>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
