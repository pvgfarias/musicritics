'use client';

import { motion } from 'motion/react';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='bg-amber-50 dark:bg-slate-950 text-white py-12'
    >
      <div className='mt-8 pt-8 border-t border-gray-800 text-center'>
        <p className='text-gray-900 dark:text-gray-400'>
          © {new Date().getFullYear()} MusiCritics. All Rights Reserved.
        </p>
      </div>
    </motion.footer>
  );
}
