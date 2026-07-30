'use client';

import SidebarLinks from './sidebar-links';
import { IconPower, IconVinyl } from '@tabler/icons-react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import ThemeToggle from './theme-toggle';
import SidebarItem from './sidebar-item';
import { sidebarItemClasses } from '@/lib/styles';

export default function Sidebar() {
  const shouldReduceMotion = useReducedMotion();
  const isAuthenticated = true;

  return (
    <div className={isAuthenticated ? '' : 'hidden'}>
      <motion.div
        initial={shouldReduceMotion ? false : { x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
        className='group/sidebar hidden md:flex flex-col h-dvh shrink-0 w-14 hover:w-52 transition-[width] duration-200 ease-in-out motion-reduce:transition-none overflow-hidden py-2 bg-ink-black text-steel-blue'
      >
        <nav
          className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 '
          aria-label='Navbar'
        >
          {/* Title */}
          <Link
            href='/'
            className='flex items-center gap-3 pl-4 pr-3 py-3 text-summer-blue font-title font-bold tracking-wider leading-none'
          >
            <IconVinyl size={20} className='shrink-0' />
            <p className='opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 whitespace-nowrap'>
              MusiCritics
            </p>
          </Link>
          <SidebarLinks />
          <div className='hidden h-auto w-full grow md:block'></div>
          <div className='w-full border border-gray-800 mx-auto' />
          <div className={sidebarItemClasses()}>
            <ThemeToggle />
          </div>
          {/* TODO: Add handle sign out */}
          <SidebarItem icon={IconPower} href={''} label={'Sign Out'} />
        </nav>
      </motion.div>{' '}
    </div>
  );
}
