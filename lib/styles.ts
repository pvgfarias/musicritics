import { cn } from '@/lib/utils';

export function sidebarItemClasses(isActive?: boolean) {
  return cn(
    'flex items-center gap-2 mx-2 px-3 py-3 rounded-lg text-xs capitalize tracking-wide',
    'text-steel-blue transition-colors duration-150',
    'hover:bg-white/5 hover:text-white',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/50',
    isActive && 'bg-white/10 text-white'
  );
}
