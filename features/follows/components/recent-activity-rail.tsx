import Link from 'next/link';
import Image from 'next/image';
import RatingScore from '@/components/dashboard/rating-score';
import { getGlobalFeed, getFollowing } from '@/features/follows/queries';
import CompactFollowButton from './compact-follow-button';

export async function RecentActivityRail({ userId }: { userId: string }) {
  const [feed, following] = await Promise.all([
    getGlobalFeed(userId, 12),
    getFollowing(userId),
  ]);
  const followingIds = new Set(following.map(u => u.id));

  return (
    <section className='flex flex-col gap-2'>
      <h2 className='text-sm font-medium text-gray-900 dark:text-white'>
        Recent activity
      </h2>
      <div className='h-px bg-gray-300 dark:bg-slate-800 w-full' />

      {feed.length === 0 ? (
        <p className='text-xs text-gray-500 dark:text-gray-400 py-2'>
          Nothing to show yet.
        </p>
      ) : (
        <ul className='flex flex-col'>
          {feed.map(rating => (
            <li
              key={rating.id}
              className='flex flex-row items-center gap-2 py-2 border-b border-gray-200 dark:border-slate-800 last:border-b-0'
            >
              <Link
                href={`/users/${rating.user.username}`}
                className='shrink-0'
              >
                <Image
                  src={rating.user.image ?? '/user.png'}
                  alt={rating.user.username}
                  width={20}
                  height={20}
                  className='rounded-full'
                />
              </Link>

              <p className='text-xs leading-tight text-gray-700 dark:text-gray-300 truncate grow min-w-0'>
                <Link
                  href={`/users/${rating.user.username}`}
                  className='font-medium text-gray-900 dark:text-white hover:text-ember'
                >
                  {rating.user.username}
                </Link>{' '}
                rated{' '}
                <Link
                  href={`/dashboard/albums/${rating.album.slug}`}
                  className='text-gray-600 dark:text-gray-400 hover:text-ember'
                >
                  {rating.album.title}
                </Link>
              </p>

              <RatingScore
                ratingScore={rating.score}
                size='sm'
                withBackground
              />

              {!followingIds.has(rating.user.id) && (
                <CompactFollowButton targetUserId={rating.user.id} />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
