'use client';

import Link from 'next/link';
import SidebarLinks from './sidebar-links';
import { IconPower } from '@tabler/icons-react';
import ThemeToggle from '../layout/theme-toggle';
import { IconDisc } from '@tabler/icons-react';
import { motion } from 'motion/react';

export default function Sidebar() {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='flex flex-col h-full py-2 bg-mist-900 text-gray-400  border-r-amber-600 border-r-4'
    >
      <Link className='pt-4' href='/'>
        <div className='flex flex-row justify-center items-center gap-2 text-white'>
          <IconDisc
            size={32}
            className='shrink-0 translate-y-0.5 text-amber-600'
          />
          <h1 className='text-2xl font-semibold leading-none font-title'>
            MusiCritics
          </h1>
        </div>
      </Link>
      <div className='border-t-2 border-dotted border-gray-400 my-4' />
      <div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
        <SidebarLinks />
        <div className='hidden h-auto w-full grow rounded-m md:block'></div>
        <div className='border-t-2 border-dotted border-gray-400 my-4' />
        <div className='hidden md:block'>
          <div className='flex flex-row justify-center items-center gap-2'>
            <ThemeToggle />
            <IconPower className='w-6 cursor-pointer' />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
