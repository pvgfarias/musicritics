import { IconCheck } from '@tabler/icons-react';
import Image from 'next/image';

import currentRatings from '@/data/currentRatings';
import RatingGrade from './rating-grade';

type Rating = (typeof currentRatings)[number];

export default function AlbumCard({ rating }: { rating: Rating }) {
  return (
    <div className='rounded-xl w-50 h-80 bg-white dark:bg-mist-800 shadow-sm  z-0 group cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1.5 hover:rotate-[-0.4deg] hover:shadow-xl'>
      <div className='flex flex-col'>
        <div className='relative w-full'>
          {rating.status && !rating.finalized && (
            <IconCheck
              size={32}
              className='absolute text-white z-20 bg-lime-500 rounded-full border-2 border-mist-100 -right-2.5 -top-2.5'
            />
          )}
          {rating.finalized && rating.finalGrade !== undefined && (
            <RatingGrade ratingGrade={rating.finalGrade} />
          )}
          <Image
            src={`/${rating.image}`}
            alt={`${rating.albumName} by ${rating.artistName}`}
            width={200}
            height={200}
            className='rounded-t-xl z-10'
            loading='eager'
          />
        </div>

        <div className='flex flex-col h-34 p-4 justify-start'>
          <h1
            title={rating.albumName}
            className='text-base font-bold text-amber-600 leading-tight w-full overflow-hidden'
          >
            <span className='line-clamp-1'>{rating.albumName}</span>
          </h1>
          <h2 className='text-[14px] font-semibold overflow-hidden'>
            <span className='line-clamp-1'>{rating.artistName}</span>
          </h2>
          <h3 className='text-xs font-mono text-gray-400'>
            {rating.releaseYear} • {rating.genre}
          </h3>
          {rating.finalized && (
            <button className='mt-2 inline-block rounded-lg bg-transparent font-semibold py-1 text-[10px] md:text-xs text-amber-600 border-amber-600 border-2 transition-all duration-200 hover:bg-gray-100 cursor-pointer w-full'>
              <span>VIEW</span>
            </button>
          )}
          {!rating.finalized && (
            <button className='mt-2 inline-block rounded-lg  font-semibold py-1 text-[10px] md:text-xs text-white bg-amber-600 transition-all duration-200 hover:bg-amber-600/60 cursor-pointer w-full'>
              <span>RATE</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
