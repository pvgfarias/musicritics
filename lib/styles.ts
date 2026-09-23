import { cn } from '@/lib/utils';

export function sidebarItemClasses(isActive?: boolean) {
  return cn(
    'flex items-center gap-2 mx-2 px-3 py-3 rounded-lg text-[13px] capitalize tracking-wide',
    'text-text-secondary transition-colors duration-150',
    '[&_svg]:text-text-secondary [&_svg]:transition-colors [&_svg]:duration-150',
    'hover:bg-accent-soft/60 hover:text-foreground hover:[&_svg]:text-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/50',
    isActive && 'bg-accent-soft text-ember shadow-sm [&_svg]:text-ember'
  );
}
