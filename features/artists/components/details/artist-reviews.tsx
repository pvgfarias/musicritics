// features/artists/components/details/artist-reviews.tsx
import Image from 'next/image';
import Link from 'next/link';
import RatingGrade from '@/components/dashboard/rating-grade';
import { ArtistReviewSummary } from '@/features/albums/queries';

export function ArtistReviews({ reviews }: { reviews: ArtistReviewSummary[] }) {
  return (
    <div>
      <div className='flex flex-row justify-between items-center gap-6'>
        <h2 className='text-2xl font-title text-gray-950 dark:text-white md:text-left text-center grow'>
          Recent Reviews
        </h2>
      </div>
      <div className='h-px bg-gray-300 dark:bg-slate-800 w-full' />

      <div className='flex flex-col gap-2 mt-2'>
        {reviews.length > 0 ? (
          <ul className='flex flex-col gap-2'>
            {reviews.map(review => (
              <div key={review.id}>
                <li className='flex flex-row justify-start items-center p-2 py-4 gap-4 rounded-md'>
                  <Image
                    src={
                      review.user.image ? `/${review.user.image}` : '/user.jpg'
                    }
                    alt={`${review.user.username}'s profile picture.`}
                    width={36}
                    height={36}
                    className='rounded-full'
                  />

                  <div className='flex flex-col gap-1 grow min-w-0'>
                    <div className='flex flex-row flex-wrap items-center gap-x-1.5'>
                      <span className='text-md font-text text-gray-800 dark:text-gray-200'>
                        {review.user.username}
                      </span>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        reviewed{' '}
                        <Link
                          href={`/dashboard/albums/${review.album.slug}`}
                          className='hover:text-ember hover:underline underline-offset-2'
                        >
                          {review.album.title}
                        </Link>
                      </span>
                    </div>
                    {review.comment && (
                      <div className='text-sm text-gray-400'>
                        <p>{review.comment}</p>
                      </div>
                    )}
                  </div>

                  {review.album.coverImage && (
                    <Image
                      src={
                        review.album.coverImage.includes('http')
                          ? review.album.coverImage
                          : `/${review.album.coverImage}`
                      }
                      alt={`${review.album.title} cover`}
                      width={40}
                      height={40}
                      className='rounded-md hidden sm:block shrink-0'
                    />
                  )}

                  {review.score !== null && (
                    <span className='text-md font-text text-ember'>
                      <RatingGrade ratingGrade={review.score} size='md' />
                    </span>
                  )}
                </li>

                <div className='h-px bg-gray-300 dark:bg-slate-800 w-full' />
              </div>
            ))}
          </ul>
        ) : (
          <p className='text-md font-text text-gray-600 dark:text-gray-400'>
            No reviews available for this artist yet.
          </p>
        )}
      </div>
    </div>
  );
}
