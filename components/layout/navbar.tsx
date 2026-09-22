'use client';

import Link from 'next/link';
import UserMenu from './user-menu';
import NotificationBell from './notification-bell';
import GlobalSearch from '@/features/search/components/global-search';
import MobileNav from './mobile-nav';
import { useSession } from '@/features/auth/auth-client';

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session;

  return (
    <header className='flex items-center justify-between gap-4 px-4 md:px-6 py-2.5 border-b border-gray-300 dark:border-slate-800 bg-sidebar shrink-0'>
      <div className='flex items-center gap-3 min-w-0'>
        <MobileNav />
        <div className='w-64 max-w-full'>
          <GlobalSearch />
        </div>
      </div>

      <div className='flex items-center gap-4'>
        {isPending ? null : isAuthenticated ? (
          <>
            <NotificationBell />
            <UserMenu />
          </>
        ) : (
          <div className='flex items-center gap-2'>
            <Link
              href='/login'
              className='rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'
            >
              Sign in
            </Link>
            <Link
              href='/register'
              className='rounded-md bg-ember px-3 py-1.5 text-sm font-medium text-white hover:opacity-90'
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
