import { AlbumFull } from '@/data/albums';
import Image from 'next/image';

export default function AlbumReviews({
  album,
}: {
  album: Exclude<AlbumFull, null>;
}) {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <h2 className='text-lg font-title font-extrabold text-gray-950 dark:text-white md:text-left text-center'>
        Reviews
      </h2>
      <div className='flex flex-col gap-2'>
        {album?.ratings && album.ratingCount > 0 ? (
          <ul className='flex flex-col gap-1'>
            {album.ratings.map((rating, index) => (
              <li
                key={index}
                className='flex flex-row justify-between items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
              >
                <div className='flex flex-col w-full'>
                  <div className='flex flex-row justify-between'>
                    <div className='flex flex-row justify-start items-center gap-2 grow'>
                      <Image
                        src={
                          rating.user.image
                            ? `/${rating.user.image}`
                            : '/user.jpg'
                        }
                        alt={`${rating.user.username}'s profile picture.`}
                        width={32}
                        height={32}
                        className='rounded-full'
                      />
                      <span className='text-md font-text text-gray-800 dark:text-gray-200'>
                        {rating.user.username}
                      </span>
                    </div>
                    <span className='text-md font-text text-gray-800 dark:text-gray-200'>
                      {rating.score}
                    </span>
                  </div>
                  {rating.comment && (
                    <div className='mt-2 ml-4'>
                      <div className='text-sm text-gray-600'>
                        <p>{rating.comment.body}</p>
                      </div>
                    </div>
                  )}
                </div>
              </li>
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
