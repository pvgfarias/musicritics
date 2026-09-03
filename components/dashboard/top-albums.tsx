import currentRatings from '@/data/currentRatings';
import Image from 'next/image';
import RatingScore from './rating-score';

export default function TopAlbums() {
  const recentReviews = currentRatings.filter(
    rating => rating.finalized === true
  );

  return (
    <div>
      <h3 className='text-lg font-title font-extrabold text-gray-950 dark:text-white md:text-left text-center pb-2'>
        Top Albums
      </h3>
      <div className='flex flex-col max-h-80 overflow-y-auto'>
        {recentReviews.map((review, index) => (
          <div
            className='flex flex-row justify-center items-center gap-2 h-10'
            key={review.id}
          >
            <span className='text-dark-blue dark:text-gray-200 text-xs'>
              {index + 1}
            </span>
            <Image
              src={`/${review.image}`}
              alt={`${review.albumName} by ${review.artistName}`}
              width={32}
              height={32}
              className='rounded-xl object-cover shrink-0'
            />
            <div className='flex flex-col grow'>
              <span className='text-dark-blue dark:text-white text-xs'>
                {review.albumName}
              </span>
              <span className='text-gray-600 dark:text-gray-400 text-xs'>
                {review.artistName}
              </span>
            </div>
            <span className='text-dark-blue dark:text-gray-200 text-xs'>
              {review.finalGrade}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
