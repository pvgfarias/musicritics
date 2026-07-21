'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { IconVinyl } from '@tabler/icons-react';
import ThemeToggle from './theme-toggle';

const navLinks = [
  { name: 'Home', ptName: 'Início', href: '/' },
  { name: 'Login', ptName: 'Login', href: '/login' },
  { name: 'Register', ptName: 'Cadastrar', href: '/register' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex flex-row gap-2 text-amber-600 justify-center items-center'>
            <IconVinyl size={32} className='shrink-0 translate-y-0.5' />
            <Link
              href='/'
              className='text-2xl font-bold italic tracking-wider leading-none'
            >
              musicritics
            </Link>
          </div>

          {/* Web Nav */}
          <div className='hidden md:flex space-x-8 justify-center items-center'>
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className='font-semibold text-gray-700 dark:text-gray-300 hover:text-amber-600 cursor-pointer transition-colors duration-200'
              >
                {link.name}
              </Link>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
