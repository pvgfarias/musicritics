import Image from 'next/image';

import currentRatings from '@/data/currentRatings';
import RatingGrade from './rating-grade';
import Link from 'next/link';

type Rating = (typeof currentRatings)[number];

export default function ReviewCard({ rating }: { rating: Rating }) {
  return (
    <div className='rounded-xl w-110 p-4 bg-foreground shadow-sm  z-0 group cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1.5 hover:rotate-[-0.4deg] hover:shadow-lg'>
      <div className='flex flex-row gap-4 items-center'>
        <div className='relative'>
          {rating.finalGrade !== undefined && (
            <RatingGrade ratingGrade={rating.finalGrade} inAlbum={false} />
          )}
          <Image
            src={`/${rating.image}`}
            alt={`${rating.albumName} by ${rating.artistName}`}
            width={56}
            height={56}
            className='rounded-md z-10'
            loading='eager'
          />
        </div>
        <div className='flex-1'>
          <h1
            title={rating.albumName}
            className='text-sm font-title font-bold text-dark-blue dark:text-white leading-tight w-full overflow-hidden truncate'
          >
            {rating.albumName}
          </h1>
          <p className='text-sm font-semibold text-gray-600 dark:text-gray-300 overflow-hidden'>
            <span className='line-clamp-1'>{rating.artistName}</span>
          </p>
          <h3 className='text-xs font-mono text-gray-400 uppercase'>
            {rating.releaseDate} • {rating.genre}
          </h3>
        </div>
        <button className='bg-transparent font-semibold text-dark-blue border-dark-blue border-2 transition-all duration-200 hover:bg-gray-100 cursor-pointer p-2 text-xs rounded-md h-1/2'>
          VIEW
        </button>
      </div>
    </div>
  );
}
