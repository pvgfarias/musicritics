import Image from 'next/image';
import RatingScore from '@/components/dashboard/rating-score';
import { IconMessageCircle } from '@tabler/icons-react';
import type { RatedAlbum } from '@/features/ratings/queries';

export const RATING_ROW_GRID =
  'grid grid-cols-[3rem_1fr_6.5rem_4.5rem_4.5rem_2.5rem] items-center gap-4';

function formatRatedDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function RatingListRow({ album }: { album: RatedAlbum }) {
  return (
    <div
      className='group border-b border-gray-300 dark:border-slate-800
            cursor-pointer
            transition-colors duration-150
            hover:bg-gray-100 dark:hover:bg-slate-900'
    >
      <div className={`${RATING_ROW_GRID} p-2`}>
        <div className='relative w-12.5 h-12.5 shrink-0 overflow-hidden rounded-sm'>
          <Image
            src={album.coverImage ?? '/albums.jpg'}
            alt={`${album.title} by ${album.artists[0]?.artist.name}`}
            fill
            className='object-cover transition-transform duration-200 group-hover:scale-105'
          />
        </div>

        <div className='flex flex-col grow min-w-0'>
          <p className='font-title font-bold text-sm text-dark-blue dark:text-white line-clamp-1 transition-colors duration-150 group-hover:text-orange-500'>
            {album.title}
          </p>
          <p className='text-[13px] text-gray-700 dark:text-gray-300 line-clamp-1'>
            {album.artists[0]?.artist.name}
          </p>
        </div>

        <span className='text-center text-sm text-gray-500 dark:text-slate-400'>
          {formatRatedDate(album.ratedAt)}
        </span>

        {/* Your score — same size/treatment as the public score here (list
            rows are already dense/scannable), but it comes first since it's
            what this page is about. */}
        <div className='flex justify-center'>
          <RatingScore
            ratingScore={album.userRating}
            size='sm'
            withBackground
          />
        </div>

        <div className='flex justify-center'>
          <RatingScore
            ratingScore={!album.openForRatings ? album.averageRating : null}
            size='sm'
          />
        </div>

        <div className='flex justify-center text-gray-500'>
          {album.hasReview && (
            <IconMessageCircle size={16} title='You left a review' />
          )}
        </div>
      </div>
    </div>
  );
}
