'use client';

import Image from 'next/image';
import Link from 'next/link';
import RatingScore from '@/components/dashboard/rating-score';
import { IconDisc } from '@tabler/icons-react';
import type { ActiveRotationAlbum } from '@/features/rotations/queries';

export default function CurrentRotationAlbumCard({
  album,
}: {
  album: ActiveRotationAlbum;
}) {
  return (
    <Link
      href={`/dashboard/albums/${album.slug}`}
      className='group flex flex-col w-full shrink-0 rounded-sm
        transition-all duration-200 ease-out
        hover:-translate-y-1.5 hover:shadow-lg
        bg-transparent hover:bg-gray-100 dark:hover:bg-slate-900'
    >
      <div className='relative w-full aspect-square shrink-0 overflow-hidden rounded-t-sm'>
        {album.coverImage ? (
          <Image
            src={album.coverImage}
            alt={`${album.title} by ${album.artist}`}
            fill
            className='object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]'
          />
        ) : (
          <div className='w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
            <IconDisc size={40} className='text-gray-400 dark:text-gray-500' />
          </div>
        )}
        <div
          className={`absolute flex justify-center items-center gap-1 font-mono px-1.5 py-0.5 text-[10px] rounded-md bottom-2 right-2 uppercase ${
            album.userRating != null
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-600 text-gray-200'
          }`}
        >
          {album.userRating != null ? 'Rated' : 'Not rated'}
        </div>
        {album.userRating != null && (
          <div className='mt-1'>
            <RatingScore
              ratingScore={album.userRating}
              size='md'
              inAlbum={true}
              withBackground={true}
            />
          </div>
        )}
      </div>

      <div className='flex flex-col p-2.5 justify-start gap-0.5'>
        <p className='font-title font-bold text-sm text-dark-blue dark:text-white line-clamp-1 group-hover:text-orange-500 transition-colors duration-200'>
          {album.title}
        </p>
        <p className='text-[13px] text-gray-700 dark:text-gray-300 line-clamp-1'>
          {album.artist}
        </p>
      </div>
    </Link>
  );
}
