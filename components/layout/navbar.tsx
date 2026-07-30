'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import SearchBar from '../ui/search-bar';
import WeeklyPicksBar from '../dashboard/weekly-picks-bar';
import UserMenu from './user-menu';

// const navLinks = [
//   { name: 'Home', ptName: 'Início', href: '/' },
//   { name: 'Login', ptName: 'Login', href: '/login' },
//   { name: 'Register', ptName: 'Cadastrar', href: '/register' },
// ];

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-40 h-16 w-full flex flex-row justify-between items-center px-4 sm:px-6 lg:px-8 bg-foreground border-b border-gray-300`}
    >
      {/* Web Nav */}
      <div className='flex flex-row justify-start items-center w-full gap-6'>
        <SearchBar />
        <WeeklyPicksBar />
      </div>

      <UserMenu />
    </motion.nav>
  );
}

{
  /* {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className='font-semibold text-gray-700 dark:text-gray-300 hover:text-summer-blue cursor-pointer transition-colors duration-200'
              >
                {link.name}
              </Link>
            ))} */
}
