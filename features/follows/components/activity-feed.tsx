import Image from 'next/image';
import Link from 'next/link';
import RatingScore from '@/components/dashboard/rating-score';
import {
  getFollowingFeed,
  getSuggestedUsers,
} from '@/features/follows/queries';
import { SuggestedUserRow } from './suggested-user-row';

export async function ActivityFeed({ userId }: { userId: string }) {
  const feed = await getFollowingFeed(userId);

  if (feed.length === 0) {
    const suggested = await getSuggestedUsers(userId);
    return (
      <section className='flex flex-col gap-3'>
        <h2 className='text-xl font-title text-gray-900 dark:text-white'>
          Activity
        </h2>
        <div className='flex flex-col gap-2 items-start py-6 px-4 rounded-md bg-gray-50 dark:bg-slate-900'>
          <p className='text-sm text-gray-700 dark:text-gray-300'>
            Follow people to see their ratings here.
          </p>
          {suggested.length > 0 && (
            <div className='flex flex-col gap-1 w-full mt-2'>
              {suggested.map(u => (
                <SuggestedUserRow key={u.id} user={u} />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className='flex flex-col gap-2'>
      <h2 className='text-xl font-title text-gray-900 dark:text-white'>
        Activity
      </h2>
      <div className='h-px bg-gray-300 dark:bg-slate-800 w-full' />
      <ul className='flex flex-col gap-2'>
        {feed.map(rating => (
          <li
            key={rating.id}
            className='flex flex-row items-center gap-4 p-2 py-4'
          >
            <Link href={`/users/${rating.user.username}`}>
              <Image
                src={rating.user.image ?? '/user.png'}
                alt={rating.user.username}
                width={36}
                height={36}
                className='rounded-full shrink-0'
              />
            </Link>
            <Image
              src={rating.album.coverImage ?? '/albums.jpg'}
              alt={rating.album.title}
              width={48}
              height={48}
              className='rounded-md shrink-0'
            />
            <div className='flex flex-col gap-1 grow min-w-0'>
              <p className='text-sm text-gray-800 dark:text-gray-200'>
                <Link
                  href={`/users/${rating.user.username}`}
                  className='font-medium hover:text-ember'
                >
                  {rating.user.username}
                </Link>{' '}
                rated{' '}
                <Link
                  href={`/dashboard/albums/${rating.album.slug}`}
                  className='font-medium hover:text-ember'
                >
                  {rating.album.title}
                </Link>
              </p>
              {rating.comment && (
                <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2'>
                  {rating.comment.body}
                </p>
              )}
            </div>
            <RatingScore ratingScore={rating.score} size='md' />
          </li>
        ))}
      </ul>
    </section>
  );
}
