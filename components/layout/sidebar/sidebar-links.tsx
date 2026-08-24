// components/sidebar-links.tsx
'use client';
import { usePathname } from 'next/navigation';
import { Icon } from '@tabler/icons-react';
import SidebarItem from './sidebar-item';

export type SidebarLink = {
  name: string;
  href: string;
  icon: Icon;
  exact?: boolean;
};

export default function SidebarLinks({ links }: { links: SidebarLink[] }) {
  const pathname = usePathname();

  return (
    <div className='flex flex-col gap-1 w-full'>
      {links.map(link => {
        const LinkIcon = link.icon;
        const isCurrentPath = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(link.href + '/');

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
