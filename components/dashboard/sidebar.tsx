import Link from 'next/link';
import SidebarLinks from './sidebar-links';
import { IconPower } from '@tabler/icons-react';
import ThemeToggle from '../layout/theme-toggle';
import { IconVinyl } from '@tabler/icons-react';

export default function Sidebar() {
  return (
    <div className='flex flex-col h-full px-3 py-4 md:px-2 bg-amber-50 text-gray-900 dark:bg-slate-900 dark:text-white'>
      <Link
        className='mb-2 flex h-20 items-end justify-start rounded-md bg-amber-600 p-4 md:h-40'
        href='/'
      >
        <div className='flex flex-row justify-center items-center gap-2 text-white'>
          <IconVinyl size={32} className='shrink-0 translate-y-0.5' />
          <h1 className='text-2xl font-bold italic tracking-wider leading-none'>
            MusiCritics
          </h1>
        </div>
      </Link>
      <div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
        <SidebarLinks />

        <div className='hidden h-auto w-full grow rounded-m md:block'></div>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row justify-center items-center gap-2'>
            <ThemeToggle />
            <IconPower className='w-6' />
          </div>
        </div>
      </div>
    </div>
  );
}
