import currentRatings from '@/data/currentRatings';
import Image from 'next/image';
import RatingGrade from './rating-grade';

export default function RecentReviews() {
  const recentReviews = currentRatings.filter(
    rating => rating.finalized === true
  );

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row w-full justify-between items-center px-4 md:px-0 pt-4 gap-4'>
        <h1 className='text-lg font-title font-extrabold text-gray-950 dark:text-white md:text-left text-center pb-6'>
          Recent Reviews
        </h1>

        <div className='flex items-center rounded-xl border border-gray-400 dark:border-mist-600 py-1 px-4'>
          <span className='whitespace-nowrap font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-white'>
            TOTAL: {recentReviews.length}
          </span>
        </div>
      </div>

      <div className='flex flex-col bg-foreground rounded-xl mb-4 divide-y divide-gray-200 dark:divide-stone-800 max-h-105 overflow-y-auto'>
        {recentReviews.map(review => (
          <div
            className='flex flex-row items-center gap-3 px-4 py-3 text-dark-blue dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-mist-800/50'
            key={review.id}
          >
            <Image
              src={`/${review.image}`}
              alt={`${review.albumName} by ${review.artistName}`}
              width={50}
              height={50}
              className='rounded-xl object-cover shrink-0'
            />
            <div className='flex flex-col text-xs flex-1 min-w-0 gap-0.5'>
              <p className='font-semibold truncate'>{review.albumName}</p>
              <p className='text-gray-600 dark:text-gray-300 truncate'>
                {review.artistName}
              </p>
              <p className='text-gray-500 dark:text-gray-400'>
                {review.releaseDate}
              </p>
            </div>
            {review.finalGrade && (
              <RatingGrade ratingGrade={review.finalGrade} inAlbum={false} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
