import { cn } from '@/lib/utils';

export function sidebarItemClasses(isActive?: boolean) {
  return cn(
    'flex items-center gap-2 mx-2 px-3 py-3 rounded-lg text-[13px] capitalize tracking-wide',
    'text-gray-600 dark:text-gray-400 transition-colors duration-150',
    'hover:bg-sidebar-active hover:text-black dark:hover:text-white',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/50',
    isActive && 'bg-sidebar-active text-black dark:text-white'
  );
}
