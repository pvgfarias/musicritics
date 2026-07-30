'use client';

import { motion, AnimatePresence } from 'motion/react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import AlbumCard from '../dashboard/album-card';
import currentRatings from '@/data/currentRatings';
import { useResponsiveCardCount } from '@/hooks/useResponsiveCardCount';
import { useSearchParams } from 'next/navigation';

const containerVariants = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
  exit: { opacity: 0, x: -60, transition: { duration: 0.25 } },
};

const cardVariants = {
  hidden: { x: 40, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.35 } },
};

export default function CardGrid({
  cardsList,
  MAX_CARDS: fallbackMaxCards,
}: {
  cardsList: typeof currentRatings;
  MAX_CARDS: number;
}) {
  const MAX_CARDS = useResponsiveCardCount(fallbackMaxCards);

  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const genre = searchParams.get('genre');
  const status = searchParams.get('status');

  const filteredCards = useMemo(() => {
    return cardsList.filter(rating => {
      if (query) {
        const q = query.toLowerCase();
        const matchesArtist = rating.artistName.some(name =>
          name.toLowerCase().includes(q)
        );
        const matchesAlbum = rating.albumName.toLowerCase().includes(q);
        if (!matchesArtist && !matchesAlbum) return false;
      }
      if (genre && genre !== 'All' && rating.genre !== genre) return false;
      if (status && status !== 'All') {
        if (status === 'Open' && rating.finalized) return false;
        if (status === 'Finalized' && !rating.finalized) return false;
      }
      return true;
    });
  }, [cardsList, query, genre, status]);

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / MAX_CARDS));

  const [page, setPage] = useState(0);

  // --- Reset page to 0 when filters change, without an effect ---
  // Track the filter "signature" from the previous render and compare during render.
  // If it changed, adjust state now, before this render commits — React re-renders
  // immediately with the corrected value, no extra commit/paint/flash.
  const filterKey = `${query}|${genre}|${status}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  let currentPage = page;
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    currentPage = 0;
    setPage(0);
  }

  // --- Clamp to totalPages, purely derived, no state/effect involved ---
  const effectivePage = Math.min(currentPage, totalPages - 1);

  const hasNext = effectivePage < totalPages - 1;
  const hasPrev = effectivePage > 0;
  const start = effectivePage * MAX_CARDS;
  const visibleCards = filteredCards.slice(start, start + MAX_CARDS);

  const goNext = () => hasNext && setPage(effectivePage + 1);
  const goPrev = () => hasPrev && setPage(effectivePage - 1);

  return (
    <div className='md:flex flex-col gap-4'>
      {/* Mobile */}
      <div className='grid grid-cols-1 sm:grid-cols-2 place-items-center p-4 gap-4 md:hidden w-full'>
        {filteredCards.map((rating, index) => (
          <AlbumCard
            key={rating.id}
            rating={rating}
            priority={index < 3 ? true : false}
          />
        ))}
      </div>

      {/* Web */}
      <div className='hidden md:flex md:pt-4'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={`${effectivePage}-${MAX_CARDS}-${filterKey}`}
            variants={containerVariants}
            initial='hidden'
            animate='show'
            exit='exit'
            transition={{ duration: 0.35 }}
            className='grid grid-cols-4 justify-center place-items-center gap-4'
          >
            {visibleCards.map((card, index) => (
              <motion.div variants={cardVariants} key={card.id}>
                <AlbumCard rating={card} priority={index <= 4 ? true : false} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='hidden md:flex flex-row justify-center items-center'>
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className={`px-2 py-2 shrink-0 ${hasPrev ? 'text-gray-900 dark:text-white cursor-pointer' : 'text-gray-400'}`}
        >
          <IconChevronLeft size={32} />
        </button>
        <span className='text-xs font-mono text-gray-800 dark:text-white'>
          {effectivePage + 1}/{totalPages}
        </span>
        <button
          onClick={goNext}
          disabled={!hasNext}
          className={`px-2 py-2 shrink-0 ${hasNext ? 'text-gray-900 dark:text-white cursor-pointer' : 'text-gray-400'}`}
        >
          <IconChevronRight size={32} />
        </button>
      </div>
    </div>
  );
}
