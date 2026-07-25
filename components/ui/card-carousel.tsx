'use client';

import { motion, AnimatePresence } from 'motion/react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';
import AlbumCard from '../dashboard/album-card';
import currentRatings from '@/data/currentRatings';

export default function CardCarousel({
  cardsList,
  MAX_CARDS,
}: {
  cardsList: typeof currentRatings;
  MAX_CARDS: number;
}) {
  const totalPages = Math.ceil(cardsList.length / MAX_CARDS);

  const [page, setPage] = useState<number>(0);
  const hasNext = page < totalPages - 1;
  const hasPrev = page > 0;
  const start = page * MAX_CARDS;
  const visibleCards = cardsList.slice(start, start + MAX_CARDS);

  const goNext = () => hasNext && setPage(prev => prev + 1);
  const goPrev = () => hasPrev && setPage(prev => prev - 1);

  return (
    <div>
      {/* Mobile */}
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 md:hidden w-full'>
        {cardsList.map((rating, index) => (
          <AlbumCard key={rating.id} rating={rating} index={index} />
        ))}
      </div>

      {/* Web */}
      <div className='hidden md:flex flex-row justify-start items-start py-4 '>
        {hasPrev ? (
          <button
            onClick={goPrev}
            className='px-2 py-2 text-gray-900 cursor-pointer shrink-0'
          >
            <IconChevronLeft size={32} />
          </button>
        ) : (
          <div className='shrink-0' />
        )}

        <AnimatePresence mode='wait'>
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35 }}
            className='flex flex-row gap-6 flex-nowrap'
          >
            {visibleCards.map((card, index) => (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                key={card.id}
                className='w-45 shrink-0'
              >
                <AlbumCard rating={card} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {hasNext ? (
          <button
            onClick={goNext}
            className='px-2 py-2 text-gray-900 cursor-pointer m-auto shrink-0'
          >
            <IconChevronRight size={32} />
          </button>
        ) : (
          <div className='shrink-0' />
        )}
      </div>
    </div>
  );
}
