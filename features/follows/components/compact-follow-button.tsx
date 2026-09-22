'use client';

import { useState, useTransition } from 'react';
import { IconPlus, IconCheck } from '@tabler/icons-react';
import { followUser } from '@/features/follows/actions';

export default function CompactFollowButton({
  targetUserId,
}: {
  targetUserId: string;
}) {
  const [followed, setFollowed] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (followed) {
    return (
      <span className='flex items-center justify-center w-5 h-5 shrink-0 text-emerald-500'>
        <IconCheck size={13} />
      </span>
    );
  }

  return (
    <button
      onClick={() => {
        setFollowed(true); // optimistic
        startTransition(() => {
          followUser(targetUserId).catch(() => setFollowed(false));
        });
      }}
      disabled={isPending}
      aria-label='Follow'
      title='Follow'
      className='flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 dark:border-slate-700 text-gray-500 hover:border-ember hover:text-ember shrink-0 disabled:opacity-50'
    >
      <IconPlus size={13} />
    </button>
  );
}
