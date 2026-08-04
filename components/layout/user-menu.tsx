import { sidebarItemClasses } from '@/lib/styles';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function UserMenu() {
  return (
    <button
      type='button'
      aria-label='Open user menu'
      className={cn(sidebarItemClasses(), 'justify-start')}
    >
      <Image
        src='/jr.jpg'
        height={28}
        width={28}
        alt=''
        className='rounded-full shrink-0'
      />
      <span className='whitespace-nowrap truncate'>User Name</span>
    </button>
  );
}
