'use client';

import { motion, AnimatePresence } from 'motion/react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';
import AlbumCard from '../dashboard/album-card';
import currentRatings from '@/data/currentRatings';
import { useResponsiveCardCount } from '@/hooks/useResponsiveCardCount';
import ReviewCard from '../dashboard/review-card';

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

export default function CardCarousel({
  cardsList,
  MAX_CARDS: fallbackMaxCards,
  type,
}: {
  cardsList: typeof currentRatings;
  MAX_CARDS: number;
  type: string;
}) {
  const MAX_CARDS = useResponsiveCardCount(fallbackMaxCards);
  const totalPages = Math.ceil(cardsList.length / MAX_CARDS);

  const [page, setPage] = useState<number>(0);
  const hasNext = page < totalPages - 1;
  const hasPrev = page > 0;
  const start = page * MAX_CARDS;
  const visibleCards = cardsList.slice(start, start + MAX_CARDS);

  const goNext = () => hasNext && setPage(prev => prev + 1);
  const goPrev = () => hasPrev && setPage(prev => prev - 1);

  return (
    <div className='md:flex flex-col gap-4'>
      {/* Mobile */}
      <div className='grid grid-cols-1 sm:grid-cols-2 place-items-center p-4 gap-4 md:hidden w-full'>
        {cardsList.map((rating, index) =>
          type === 'album' ? (
            <AlbumCard
              key={rating.id}
              rating={rating}
              priority={index <= 4 ? true : false}
            />
          ) : (
            <ReviewCard key={rating.id} rating={rating} />
          )
        )}
      </div>

      {/* Web */}
      <div className='hidden md:flex md:pt-4'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={`${page}-${MAX_CARDS}`}
            variants={containerVariants}
            initial='hidden'
            animate='show'
            exit='exit'
            transition={{ duration: 0.35 }}
            className='flex flex-row justify-center items-center gap-4 flex-nowrap'
          >
            {visibleCards.map((card, index) => (
              <motion.div variants={cardVariants} key={card.id}>
                {type === 'album' ? (
                  <AlbumCard
                    rating={card}
                    priority={index <= 4 ? true : false}
                  />
                ) : (
                  <ReviewCard rating={card} />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className='hidden md:flex flex-row justify-center items-center'>
        <button
          onClick={goPrev}
          className={`px-2 py-2 shrink-0 ${hasPrev ? 'text-gray-900 dark:text-white cursor-pointer' : 'text-gray-400'}`}
        >
          <IconChevronLeft size={32} />
        </button>
        <span className='text-xs font-mono text-gray-800 dark:text-white'>
          {page + 1}/{totalPages}
        </span>
        <button
          onClick={goNext}
          className={`px-2 py-2 shrink-0 ${hasNext ? 'text-gray-900 dark:text-white cursor-pointer' : 'text-gray-400'}`}
        >
          <IconChevronRight size={32} />
        </button>
      </div>
    </div>
  );
}
