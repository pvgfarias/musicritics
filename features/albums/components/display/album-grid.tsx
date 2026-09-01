'use client';

import { motion, AnimatePresence } from 'motion/react';
import AlbumCard from '../cards/album-card';
import type { AlbumSummary } from '@/features/albums/queries';
import Link from 'next/link';
import type { User } from '@/lib/auth';

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

const MAX_ALBUMS = 5;

export function AlbumGrid({
  albumList,
  renderCardActions,
  user,
}: {
  albumList: AlbumSummary[];
  renderCardActions?: (album: AlbumSummary) => React.ReactNode;
  user?: User;
}) {
  return (
    <>
      {/* Mobile */}
      <div className='grid grid-cols-2 sm:grid-cols-3 place-items-center p-4 gap-4 md:hidden w-full'>
        {albumList.map((album, index) => (
          <AlbumCard
            key={album.id}
            album={album}
            priority={index < 3}
            actions={renderCardActions?.(album)}
            user={user}
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
            {albumList.map((album, index) => (
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
                  <AlbumCard
                    album={album}
                    priority={index < MAX_ALBUMS}
                    actions={renderCardActions?.(album)}
                    user={user}
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
