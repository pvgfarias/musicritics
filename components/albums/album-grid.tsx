'use client';

import { motion, AnimatePresence } from 'motion/react';
import AlbumCard from '../dashboard/album-card';
import AlbumCardSkeleton from '../dashboard/album-card-skeleton';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import type { AlbumSummary } from '@/data/albums';

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

export function AlbumGrid({ albumList }: { albumList: AlbumSummary[] }) {
  const PAGE_SIZE = 15;
  const MAX_ALBUMS = 5;
  const { visibleItems, hasMore, isLoadingMore, sentinelRef } =
    useInfiniteScroll(albumList, PAGE_SIZE);

  return (
    <>
      {/* Mobile */}
      <div className='grid grid-cols-2 sm:grid-cols-3 place-items-center p-4 gap-4 md:hidden w-full'>
        {visibleItems.map((album, index) => (
          <AlbumCard key={album.id} album={album} priority={index < 3} />
        ))}
      </div>

      {/* Web */}
      <div className='hidden md:flex md:flex-col md:pt-4 md:gap-4'>
        <motion.div
          layout
          className='grid gap-6 w-full grid-cols-[repeat(auto-fit,minmax(11.5rem,14rem))]'
        >
          <AnimatePresence initial={false}>
            {visibleItems.map((album, index) => (
              <motion.div
                layout
                variants={cardVariants}
                initial='hidden'
                animate='show'
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                key={album.id}
              >
                <AlbumCard album={album} priority={index < MAX_ALBUMS} />
              </motion.div>
            ))}
            {isLoadingMore &&
              Array.from({ length: MAX_ALBUMS }).map((_, i) => (
                <AlbumCardSkeleton key={`skeleton-${i}`} />
              ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {hasMore && <div ref={sentinelRef} className='h-px w-full' aria-hidden />}
    </>
  );
}
