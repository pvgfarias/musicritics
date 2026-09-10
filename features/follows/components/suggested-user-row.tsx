'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FollowButton } from './follow-button';

type Props = {
  user: {
    id: string;
    username: string;
    image: string | null;
    bio: string | null;
  };
};

export function SuggestedUserRow({ user }: Props) {
  return (
    <div className='flex flex-row items-center gap-3 py-1.5 w-full'>
      <Link
        href={`/users/${user.username}`}
        className='flex flex-row items-center gap-3 grow min-w-0'
      >
        <Image
          src={user.image ?? '/user.png'}
          alt={user.username}
          width={32}
          height={32}
          className='rounded-full shrink-0'
        />
        <div className='flex flex-col min-w-0'>
          <span className='text-sm font-medium text-gray-800 dark:text-gray-200'>
            {user.username}
          </span>
          {user.bio && (
            <span className='text-xs text-gray-500 dark:text-gray-400 line-clamp-1'>
              {user.bio}
            </span>
          )}
        </div>
      </Link>
      <FollowButton targetUserId={user.id} initiallyFollowing={false} />
    </div>
  );
}
