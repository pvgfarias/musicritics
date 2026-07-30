import type { Icon as TablerIcon } from '@tabler/icons-react';
import { sidebarItemClasses } from '@/lib/styles';
import Link from 'next/link';

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
      className={sidebarItemClasses(isActive)}
      {...props}
      href={href}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon size={20} className='shrink-0' />
      <span className='opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 whitespace-nowrap'>
        {label}
      </span>
    </Link>
  );
}
