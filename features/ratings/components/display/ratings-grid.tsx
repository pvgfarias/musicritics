'use client';

import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import RatingCard from '../cards/rating-card';
import type { RatedAlbum } from '@/features/ratings/queries';

const MAX_PRIORITY = 5;

export function RatingsGrid({ albums }: { albums: RatedAlbum[] }) {
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <>
      {/* Mobile */}
      <div className='grid grid-cols-2 sm:grid-cols-3 place-items-center p-4 gap-4 md:hidden w-full'>
        {albums.map((album, index) => (
          <Link key={album.id} href={`/dashboard/albums/${album.slug}`}>
            <RatingCard album={album} priority={index < 3} />
          </Link>
        ))}
      </div>

      {/* Web */}
      <div className='hidden md:flex md:flex-col md:pt-4 md:gap-4'>
        <motion.div
          layout
          className='grid gap-6 w-full grid-cols-[repeat(auto-fit,minmax(11.5rem,14rem))]'
        >
          <AnimatePresence initial={false}>
            {albums.map((album, index) => (
              <motion.div
                layout
                variants={cardVariants}
                initial='hidden'
                animate='show'
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                key={album.id}
              >
                <Link
                  href={`/dashboard/albums/${album.slug}`}
                  className='w-full'
                >
                  <RatingCard album={album} priority={index < MAX_PRIORITY} />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
