import { IconCheck } from '@tabler/icons-react';
import Image from 'next/image';

import currentRatings from '@/data/currentRatings';
import RatingGrade from './rating-grade';
import Link from 'next/link';

type Rating = (typeof currentRatings)[number];

export default function AlbumCard({ rating }: { rating: Rating }) {
  return (
    <div className='flex flex-row w-96 h-40 bg-foreground dark:bg-mist-800 shadow-sm cursor-pointer rounded-xl transition-all duration-200 ease-out hover:-translate-y-1.5 hover:rotate-[-0.4deg] hover:shadow-xl'>
      {/* {rating.status && !rating.finalized && (
            <IconCheck
              size={32}
              className='absolute text-white z-20 bg-lime-500 rounded-full border-2 border-mist-100 -right-2.5 -top-2.5'
            />
          )} */}
      {/* {rating.finalized && rating.finalGrade !== undefined && (
            <RatingGrade ratingGrade={rating.finalGrade} />
          )} */}
      <Image
        src={`/${rating.image}`}
        alt={`${rating.albumName} by ${rating.artistName}`}
        width={160}
        height={160}
        className='rounded-l-xl'
        loading='eager'
      />

      <div className='flex flex-col p-4 justify-start'>
        <h1
          title={rating.albumName}
          className='text-lg font-title text-summer-blue overflow-hidden truncate'
        >
          {rating.albumName}
        </h1>
        <h2 className='text-md font-title overflow-hidden'>
          <span className='line-clamp-1'>{rating.artistName}</span>
        </h2>
        <h3 className='text-xs font-mono text-gray-400 uppercase'>
          {rating.releaseYear} • {rating.genre}
        </h3>
        {rating.finalized && (
          <button className='mt-2 inline-block rounded-lg bg-transparent font-semibold py-1 text-[10px] md:text-xs text-summer-blue border-summer-blue border-2 transition-all duration-200 hover:bg-gray-100 cursor-pointer w-full'>
            <span>VIEW</span>
          </button>
        )}
        {!rating.finalized && (
          <Link
            href={`/dashboard/albums/${rating.id}`}
            className='mt-2 inline-block rounded-lg  font-semibold py-1 text-[10px] md:text-xs text-white bg-summer-blue transition-all duration-200 hover:bg-summer-blue/60 cursor-pointer w-full'
          >
            <span>RATE</span>
          </Link>
        )}
      </div>
    </div>
  );
}
