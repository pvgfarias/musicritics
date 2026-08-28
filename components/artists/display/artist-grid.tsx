'use client';

import { motion, AnimatePresence } from 'motion/react';
import ArtistCard from '../cards/artist-card';
import type { ArtistSummary } from '@/data/artists';
import Link from 'next/link';

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

const MAX_ARTISTS = 5;

export function ArtistGrid({
  artistList,
  renderCardActions,
}: {
  artistList: ArtistSummary[];
  renderCardActions?: (artist: ArtistSummary) => React.ReactNode;
}) {
  return (
    <>
      {/* Mobile */}
      <div className='grid grid-cols-2 sm:grid-cols-3 place-items-center p-4 gap-4 md:hidden w-full'>
        {artistList.map((artist, index) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            priority={index < 3}
            actions={renderCardActions?.(artist)}
          />
        ))}
      </div>

      {/* Web */}
      <div className='hidden md:flex md:flex-col md:pt-4 md:gap-4'>
        <motion.div
          layout
          className='grid gap-6 w-full grid-cols-[repeat(auto-fit,minmax(11.5rem,14rem))]'
        >
          <AnimatePresence initial={false}>
            {artistList.map((artist, index) => (
              <motion.div
                layout
                variants={cardVariants}
                initial='hidden'
                animate='show'
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                key={artist.id}
              >
                <Link
                  href={`/dashboard/artists/${artist.slug}`}
                  className='w-full'
                >
                  <ArtistCard
                    artist={artist}
                    priority={index < MAX_ARTISTS}
                    actions={renderCardActions?.(artist)}
                  />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
