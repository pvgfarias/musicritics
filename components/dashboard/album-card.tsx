import { IconCheck } from '@tabler/icons-react';
import Image from 'next/image';

import currentRatings from '@/data/currentRatings';
import RatingGrade from './rating-grade';
import Link from 'next/link';

type Rating = (typeof currentRatings)[number];

export default function AlbumCard({
  rating,
  priority = false,
}: {
  rating: Rating;
  priority: boolean;
}) {
  return (
    <div className='flex flex-row w-96 h-40 shrink-0 bg-foreground dark:bg-mist-800 shadow-sm cursor-pointer rounded-xl border border-gray-100 dark:border-mist-700 transition-all duration-200 ease-out hover:-translate-y-1.5 hover:rotate-[-0.4deg] hover:shadow-lg'>
      {/* {rating.status && !rating.finalized && (
            <IconCheck
              size={32}
              className='absolute text-white z-20 bg-lime-500 rounded-full border-2 border-mist-100 -right-2.5 -top-2.5'
            />
          )} */}
      {/* {rating.finalized && rating.finalGrade !== undefined && (
            <RatingGrade ratingGrade={rating.finalGrade} />
          )} */}
      <div className='relative w-40 h-40 shrink-0'>
        <Image
          src={`/${rating.image}`}
          alt={`${rating.albumName} by ${rating.artistName}`}
          fill
          className='rounded-l-xl object-cover'
          priority={priority}
        />
      </div>

      <div className='flex flex-col p-4 justify-start gap-0.5'>
        <p className='text-lg font-title font-bold text-summer-blue truncate'>
          {rating.albumName}
        </p>
        <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-1'>
          {rating.artistName}
        </p>
        <span className='inline-flex w-fit items-center text-[10px] font-mono uppercase tracking-wide text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-mist-700 rounded-full px-2 py-0.5 mt-1'>
          {rating.releaseYear} • {rating.genre}
        </span>

        {rating.finalized && (
          <Link
            href={`/dashboard/albums/${rating.id}`}
            className='mt-2 rounded-lg py-1.5 text-xs text-white bg-summer-blue shadow-sm transition-all duration-200 hover:bg-summer-blue/90 hover:shadow-md active:scale-[0.98] w-full text-center'
          >
            VIEW
          </Link>
        )}
        {!rating.finalized && (
          <Link
            href={`/dashboard/albums/${rating.id}`}
            className='mt-2 rounded-lg  py-1.5 text-xs text-white bg-summer-blue shadow-sm transition-all duration-200 hover:bg-summer-blue/90 hover:shadow-md active:scale-[0.98] w-full text-center'
          >
            RATE
          </Link>
        )}
      </div>
    </div>
  );
}
