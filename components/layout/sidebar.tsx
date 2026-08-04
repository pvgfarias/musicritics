'use client';

import SidebarLinks from './sidebar-links';
import { IconPower, IconVinyl } from '@tabler/icons-react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import ThemeToggle from './theme-toggle';
import SidebarItem from './sidebar-item';
import { sidebarItemClasses } from '@/lib/styles';
import UserMenu from './user-menu';

export default function Sidebar() {
  const shouldReduceMotion = useReducedMotion();
  const isAuthenticated = true;

  return (
    <div className={isAuthenticated ? '' : 'hidden'}>
      <motion.div
        initial={shouldReduceMotion ? false : { x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
        className='hidden md:flex flex-col h-dvh shrink-0 w-60 overflow-hidden py-2 bg-dark-blue text-steel-blue dark:border-r dark:border-foreground-border'
      >
        <nav
          className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 '
          aria-label='Sidebar'
        >
          {/* Title */}
          <Link
            href='/'
            className='flex items-center gap-2 pl-4 pr-3 py-3 text-amber-600 font-title text-xl tracking-wider leading-none'
          >
            <IconVinyl size={24} className='shrink-0' />
            <p className='whitespace-nowrap'>MusiCritics</p>
          </Link>
          <SidebarLinks />
          <div className='hidden h-auto w-full grow md:block' />
          <div className='mx-4 h-px bg-gray-800' />
          <ThemeToggle />
          <UserMenu />
        </nav>
      </motion.div>
    </div>
  );
}
