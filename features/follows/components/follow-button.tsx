'use client';

import { useState, useTransition } from 'react';
import { followUser, unfollowUser } from '@/features/follows/actions';

type Props = {
  targetUserId: string;
  initiallyFollowing: boolean;
};

export function FollowButton({ targetUserId, initiallyFollowing }: Props) {
  const [following, setFollowing] = useState(initiallyFollowing);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !following;
    setFollowing(next); // optimistic
    startTransition(async () => {
      try {
        if (next) {
          await followUser(targetUserId);
        } else {
          await unfollowUser(targetUserId);
        }
      } catch {
        setFollowing(!next); // revert on failure
      }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={
        following
          ? 'rounded-md border border-gray-300 dark:border-slate-700 px-4 py-1.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800'
          : 'rounded-md bg-ember px-4 py-1.5 text-sm font-medium text-white hover:opacity-90'
      }
    >
      {following ? 'Following' : 'Follow'}
    </button>
  );
}
