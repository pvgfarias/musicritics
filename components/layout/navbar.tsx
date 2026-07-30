'use client';

import { motion } from 'motion/react';
import SearchBar from '../ui/search-bar';
import WeeklyPicksBar from '../dashboard/weekly-picks-bar';
import UserMenu from './user-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Login', href: '/login' },
  { name: 'Register', href: '/register' },
];

export default function Navbar() {
  // TODO: replace with real auth state (e.g. useSession() / useAuth())
  const isAuthenticated = true;
  const pathname = usePathname();
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className='sticky top-0 z-40 h-16 w-full flex flex-row justify-between items-center px-4 sm:px-6 lg:px-8 bg-foreground dark:bg-ink-black border-b border-gray-300 dark:border-0'
    >
      {/* Web Nav */}

      {isAuthenticated ? (
        <div className='flex flex-row justify-start items-center w-full gap-6 min-w-0'>
          <SearchBar />
          <WeeklyPicksBar />
        </div>
      ) : (
        <div className='flex flex-row justify-end gap-4 w-full min-w-0'>
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={` ${isActive ? 'text-summer-blue' : 'text-gray-700 dark:text-gray-300'} hover:text-summer-blue cursor-pointer transition-colors duration-200`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}

      {isAuthenticated && <UserMenu />}
    </motion.nav>
  );
}
