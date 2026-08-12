'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import AlbumCard from '../dashboard/album-card';
import AlbumCardSkeleton from '../dashboard/album-card-skeleton';
import { useSearchParams } from 'next/navigation';
import { sortRatings, SortKey } from '@/lib/sort-ratings';
import type { AlbumSummary } from '@/data/albums';

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

export default function CardGrid({
  cardsList,
  MAX_CARDS,
  viewMode,
}: {
  cardsList: AlbumSummary[];
  MAX_CARDS: number;
  viewMode: 'grid' | 'list';
}) {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const genre = searchParams.get('genre');
  const status = searchParams.get('status');
  const sort = (searchParams.get('sort') as SortKey) ?? 'recent';

  const filteredCards = useMemo(() => {
    const filtered = cardsList.filter(rating => {
      if (query) {
        const q = query.toLowerCase();
        const matchesArtist = rating.artists.some(({ artist }) =>
          artist.name.toLowerCase().includes(q)
        );
        const matchesAlbum = rating.title.toLowerCase().includes(q);
        if (!matchesArtist && !matchesAlbum) return false;
      }
      if (genre && genre !== 'All' && rating.genre !== genre) return false;
      if (status && status !== 'All') {
        if (status === 'Open' && rating.finalized) return false;
        if (status === 'Finalized' && !rating.finalized) return false;
      }
      return true;
    });
    return sortRatings(filtered, sort);
  }, [cardsList, query, status, genre, sort]);

  const filterKey = `${query}|${genre}|${status}|${sort}`;

  return (
    <div key={filterKey} className='md:flex flex-col gap-4 w-full'>
      <InfiniteGrid cards={filteredCards} MAX_CARDS={MAX_CARDS} />
    </div>
  );
}

function InfiniteGrid({
  cards,
  MAX_CARDS,
}: {
  cards: AlbumSummary[];
  MAX_CARDS: number;
}) {
  const PAGE_SIZE = MAX_CARDS * 2;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visibleCards = cards.slice(0, visibleCount);
  const hasMore = visibleCount < cards.length;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsLoadingMore(true);
          // Simulated delay so the skeleton is visible; drop the
          // setTimeout if this is ever backed by a real paginated fetch.
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + PAGE_SIZE, cards.length));
            setIsLoadingMore(false);
          }, 200);
        }
      },
      { rootMargin: '400px' } // start loading before it's on-screen
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, cards.length, PAGE_SIZE]);

  return (
    <>
      {/* Mobile */}
      <div className='grid grid-cols-2 sm:grid-cols-3 place-items-center p-4 gap-4 md:hidden w-full'>
        {visibleCards.map((album, index) => (
          <AlbumCard key={album.id} album={album} priority={index < 3} />
        ))}
      </div>

      {/* Web */}
      <div className='hidden md:flex md:flex-col md:pt-4 md:gap-4'>
        <motion.div
          layout
          className='grid gap-3 w-full grid-cols-[repeat(auto-fill,11.5rem)]'
        >
          <AnimatePresence initial={false}>
            {visibleCards.map((album, index) => (
              <motion.div
                layout
                variants={cardVariants}
                initial='hidden'
                animate='show'
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                key={album.id}
              >
                <AlbumCard album={album} priority={index < MAX_CARDS} />
              </motion.div>
            ))}
            {isLoadingMore &&
              Array.from({ length: MAX_CARDS }).map((_, i) => (
                <AlbumCardSkeleton key={`skeleton-${i}`} />
              ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {hasMore && <div ref={sentinelRef} className='h-px w-full' aria-hidden />}
    </>
  );
}
