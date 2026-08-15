import { AlbumFull } from '@/data/albums';
import Image from 'next/image';

export default function AlbumReviews({
  album,
}: {
  album: Exclude<AlbumFull, null>;
}) {
  const reviews = album.ratings.filter(rating => rating.comment);

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-2xl font-title text-gray-950 dark:text-white md:text-left text-center'>
          Reviews
        </h2>
        <p className='font-mono text-xs text-gray-600 dark:text-gray-500'>
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </p>
      </div>
      <div className='h-px bg-gray-300 dark:bg-slate-800 w-full' />
      <div className='flex flex-col gap-2 mt-2'>
        {album?.ratings && album.ratingCount > 0 ? (
          <ul className='flex flex-col gap-2'>
            {reviews.map((rating, index) => (
              <div key={index}>
                <li className='flex flex-row justify-start items-center p-2 py-4 gap-4 rounded-md'>
                  <Image
                    src={
                      rating.user.image ? `/${rating.user.image}` : '/user.jpg'
                    }
                    alt={`${rating.user.username}'s profile picture.`}
                    width={36}
                    height={36}
                    className='rounded-full'
                  />

                  <div className='flex flex-col gap-2 grow'>
                    <span className='text-md font-text text-gray-800 dark:text-gray-200'>
                      {rating.user.username}
                    </span>
                    {rating.comment && (
                      <div className='text-sm text-gray-400'>
                        <p>{rating.comment.body}</p>
                      </div>
                    )}
                  </div>
                  <span className='text-md font-text text-ember'>
                    {rating.score}
                  </span>
                </li>

                <div className='h-px bg-gray-300 dark:bg-slate-800 w-full' />
              </div>
            ))}
          </ul>
        ) : (
          <p className='text-md font-text text-gray-600 dark:text-gray-400'>
            No reviews available for this album.
          </p>
        )}
      </div>
    </div>
  );
}
