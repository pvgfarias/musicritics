'use client';

import SidebarLinks from './sidebar-links';
import { IconVinyl } from '@tabler/icons-react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import UserMenu from '../user-menu';
import { useSession } from '@/features/auth/auth-client';
import { adminLinks, adminOnlyLinks, userLinks } from './sidebarLinks';

export default function Sidebar() {
  const shouldReduceMotion = useReducedMotion();
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session;
  const role = session?.user.role;
  const isPrivileged = role === 'admin' || role === 'moderator';

  if (isPending) return null;

  return (
    <div className={isAuthenticated ? '' : 'hidden'}>
      <motion.div
        initial={shouldReduceMotion ? false : { x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
        className='hidden md:flex flex-col h-dvh shrink-0 w-52 overflow-hidden py-2 bg-sidebar border-r border-gray-300 dark:border-slate-800'
      >
        <nav
          className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 '
          aria-label='Sidebar'
        >
          {/* Title */}
          <Link
            href='/'
            className='flex items-center gap-2 pl-4 pr-3 py-3 text-ember font-title text-xl tracking-wider leading-none'
          >
            <IconVinyl size={24} className='shrink-0' />
            <p className='whitespace-nowrap'>MusiCritics</p>
          </Link>
          <SidebarLinks links={userLinks} />

          {isPrivileged && (
            <div>
              <div className='h-px bg-gray-300 dark:bg-slate-800' />
              <div className='flex flex-col gap-1 pt-4'>
                <span className='px-2 text-xs uppercase text-gray-500 dark:text-white'>
                  Admin
                </span>
                <SidebarLinks
                  links={
                    role === 'admin'
                      ? [...adminLinks, ...adminOnlyLinks]
                      : adminLinks
                  }
                />
              </div>
            </div>
          )}

          <div className='hidden h-auto w-full grow md:block' />
          <div className='h-px bg-gray-300 dark:bg-slate-800' />
          <UserMenu />
        </nav>
      </motion.div>
    </div>
  );
}
