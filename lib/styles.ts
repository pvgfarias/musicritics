import { cn } from '@/lib/utils';

export function sidebarItemClasses(isActive?: boolean) {
  return cn(
    'flex items-center gap-3 pl-4 pr-3 py-3 w-full text-xs font-mono uppercase tracking-wide hover:text-white focus-visible:text-white focus-visible:outline cursor-pointer transition-colors duration-200',
    isActive && 'text-white border-l-2 border-summer-blue'
  );
}
