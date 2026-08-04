'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useMemo, useState } from 'react';
import AlbumCard from '../dashboard/album-card';
import currentRatings from '@/data/currentRatings';
import { useSearchParams } from 'next/navigation';

const containerVariants = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
  exit: { opacity: 0, x: -60, transition: { duration: 0.25 } },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

export default function CardGrid({
  cardsList,
  MAX_CARDS,
}: {
  cardsList: typeof currentRatings;
  MAX_CARDS: number;
}) {
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

  // Two rows worth of cards by default
  const DEFAULT_VISIBLE = MAX_CARDS * 2;

  const [expanded, setExpanded] = useState(false);

  // Reset expansion when filters change, derived-state style (no useEffect)
  const filterKey = `${query}|${genre}|${status}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  let currentExpanded = expanded;
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    currentExpanded = false;
    setExpanded(false);
  }

  const hasMore = filteredCards.length > DEFAULT_VISIBLE;
  const visibleCards = currentExpanded
    ? filteredCards
    : filteredCards.slice(0, DEFAULT_VISIBLE);

  return (
    <div className='md:flex flex-col gap-4 w-full'>
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
      <div className='hidden md:flex md:flex-col md:pt-4 md:gap-4'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={filterKey}
            variants={containerVariants}
            initial='hidden'
            animate='show'
            exit='exit'
            className='grid justify-center place-content-between gap-3'
            style={{
              gridTemplateColumns: `repeat(${MAX_CARDS}, minmax(0, 1fr))`,
            }}
          >
            <AnimatePresence initial={false}>
              {visibleCards.map((card, index) => (
                <motion.div
                  layout
                  variants={cardVariants}
                  initial='hidden'
                  animate='show'
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  key={card.id}
                >
                  <AlbumCard
                    rating={card}
                    priority={index < MAX_CARDS ? true : false}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {hasMore && (
          <div className='flex justify-center'>
            <button
              onClick={() => setExpanded(prev => !prev)}
              className='px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-mist-600 rounded-full hover:bg-gray-100 dark:hover:bg-mist-800 transition-colors cursor-pointer'
            >
              {currentExpanded
                ? 'Show less'
                : `View all (${filteredCards.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
