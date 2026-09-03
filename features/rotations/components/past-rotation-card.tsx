'use client';

import Image from 'next/image';
import Link from 'next/link';
import RatingGrade from '@/components/dashboard/rating-grade';
import { IconDisc } from '@tabler/icons-react';
import type { RotationSummary } from '@/features/rotations/queries';
import { formatDateRange, coverSrc } from '@/lib/format';

export default function PastRotationCard({
  rotation,
}: {
  rotation: RotationSummary;
}) {
  return (
    <Link
      href={`/rotations/${rotation.slug ?? rotation.id}`}
      className='group flex flex-col rounded-md border border-gray-300 dark:border-slate-800 p-3 gap-3
        transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-slate-900'
    >
      <div className='flex flex-col gap-0.5'>
        <p className='font-title font-bold text-base text-dark-blue dark:text-white line-clamp-1 group-hover:text-orange-500 transition-colors duration-200'>
          {rotation.name}
        </p>
        <p className='font-mono text-xs text-gray-600 dark:text-gray-400'>
          {formatDateRange(rotation.startDate, rotation.endDate)} ·{' '}
          {rotation.albumCount} {rotation.albumCount === 1 ? 'album' : 'albums'}
        </p>
      </div>

      {rotation.topAlbums.length > 0 && (
        <div className='flex flex-row gap-2'>
          {rotation.topAlbums.map(album => {
            const src = coverSrc(album.coverImage);
            return (
              <div
                key={album.id}
                className='relative w-14 h-14 shrink-0 rounded-sm overflow-hidden'
              >
                {src ? (
                  <Image
                    src={src}
                    alt={album.title}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                    <IconDisc
                      size={20}
                      className='text-gray-400 dark:text-gray-500'
                    />
                  </div>
                )}
                {album.averageRating != null && (
                  <div className='absolute bottom-0.5 right-0.5'>
                    <RatingGrade ratingGrade={album.averageRating} size='sm' />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Link>
  );
}
