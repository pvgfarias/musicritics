import type { Icon as TablerIcon } from '@tabler/icons-react';
import { sidebarItemClasses } from '@/lib/styles';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function SidebarItem({
  icon: Icon,
  label,
  isActive,
  href,
  ...props
}: {
  icon: TablerIcon;
  label: string;
  href: string;
  isActive?: boolean;
}) {
  return (
    <Link
      className={cn(sidebarItemClasses(isActive), 'relative')}
      href={href}
      {...props}
    >
      {isActive && (
        <span className='absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-amber-600' />
      )}
      <Icon size={20} className='shrink-0' />
      <span className='whitespace-nowrap'>{label}</span>
    </Link>
  );
}
