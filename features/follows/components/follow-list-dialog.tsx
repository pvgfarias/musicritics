'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  getFollowersList,
  getFollowingList,
  unfollowUser,
} from '@/features/follows/actions';

type ListUser = {
  id: string;
  username: string;
  image: string | null;
  bio: string | null;
};

type Tab = 'followers' | 'following';

type Props = {
  userId: string;
  followerCount: number;
  followingCount: number;
  isOwnProfile: boolean;
  // Which tab opens first when triggered externally (e.g. dashboard's
  // separate Followers/Following stat cards). Defaults to 'followers'.
  initialTab?: Tab;
  // Custom trigger markup (e.g. dashboard's StatCard). When omitted,
  // falls back to the original inline "X followers / X following" text.
  trigger?: React.ReactNode;
};

export function FollowListDialog({
  userId,
  followerCount,
  followingCount,
  isOwnProfile,
  initialTab = 'followers',
  trigger,
}: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>(initialTab);

  const [result, setResult] = useState<{ tab: Tab; users: ListUser[] } | null>(
    null
  );

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const fetcher = tab === 'followers' ? getFollowersList : getFollowingList;
    fetcher(userId).then(users => {
      if (!cancelled) setResult({ tab, users });
    });

    return () => {
      cancelled = true;
    };
  }, [open, tab, userId]);

  const users = result?.tab === tab ? result.users : null;

  function openTo(t: Tab) {
    setTab(t);
    setOpen(true);
  }

  function handleUnfollowed(targetId: string) {
    setResult(prev =>
      prev
        ? { ...prev, users: prev.users.filter(u => u.id !== targetId) }
        : prev
    );
  }

  return (
    <>
      {trigger ? (
        <button onClick={() => openTo(initialTab)} className='contents'>
          {trigger}
        </button>
      ) : (
        <div className='flex flex-row gap-4 font-mono text-xs text-text-secondary uppercase'>
          <button
            onClick={() => openTo('followers')}
            className='hover:text-ember'
          >
            {followerCount} followers
          </button>
          <button
            onClick={() => openTo('following')}
            className='hover:text-ember'
          >
            {followingCount} following
          </button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-h-[70vh] overflow-y-auto p-4'>
          <DialogHeader>
            <DialogTitle>
              <div className='flex flex-row gap-4 text-sm font-mono uppercase'>
                <button
                  onClick={() => setTab('followers')}
                  className={
                    tab === 'followers' ? 'text-ember' : 'text-text-secondary'
                  }
                >
                  Followers
                </button>
                <button
                  onClick={() => setTab('following')}
                  className={
                    tab === 'following' ? 'text-ember' : 'text-text-secondary'
                  }
                >
                  Following
                </button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className='h-px bg-border' />

          <div className='flex flex-col gap-1 pt-2'>
            {users === null ? (
              <p className='text-sm text-text-secondary py-4 text-center'>
                Loading…
              </p>
            ) : users.length === 0 ? (
              <p className='text-sm text-text-secondary py-4 text-center'>
                {tab === 'followers'
                  ? 'No followers yet.'
                  : 'Not following anyone yet.'}
              </p>
            ) : (
              users.map(u => (
                <FollowListRow
                  key={u.id}
                  user={u}
                  showUnfollow={isOwnProfile && tab === 'following'}
                  onUnfollowed={() => handleUnfollowed(u.id)}
                  onNavigate={() => setOpen(false)}
                />
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FollowListRow({
  user,
  showUnfollow,
  onUnfollowed,
  onNavigate,
}: {
  user: ListUser;
  showUnfollow: boolean;
  onUnfollowed: () => void;
  onNavigate: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [removed, setRemoved] = useState(false);

  function handleUnfollow() {
    setRemoved(true);
    startTransition(async () => {
      try {
        await unfollowUser(user.id);
        onUnfollowed();
      } catch {
        setRemoved(false);
      }
    });
  }

  if (removed) return null;

  return (
    <div className='flex flex-row items-center gap-3 py-2 px-1 rounded-md hover:bg-accent-soft'>
      <Link
        href={`/users/${user.username}`}
        onClick={onNavigate}
        className='flex flex-row items-center gap-3 grow min-w-0'
      >
        <Image
          src={user.image ?? '/user.png'}
          alt={user.username}
          width={36}
          height={36}
          className='rounded-full shrink-0'
        />
        <div className='flex flex-col min-w-0'>
          <span className='text-sm font-medium text-foreground'>
            {user.username}
          </span>
          {user.bio && (
            <span className='text-xs text-text-secondary line-clamp-1'>
              {user.bio}
            </span>
          )}
        </div>
      </Link>

      {showUnfollow && (
        <button
          onClick={handleUnfollow}
          disabled={isPending}
          className='shrink-0 rounded-md border border-border px-3 py-1 text-xs font-medium hover:bg-accent-soft disabled:opacity-50'
        >
          Unfollow
        </button>
      )}
    </div>
  );
}
