import Link from 'next/link';
import {
  IconStar,
  IconUsers,
  IconUserPlus,
  IconRefresh,
  IconFlame,
} from '@tabler/icons-react';
import { auth } from '@/features/auth/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getFollowCounts } from '@/features/follows/queries';
import { getActiveRotation } from '@/features/rotations/queries';
import CurrentRotationSection from '@/features/rotations/components/current-rotation-section';
import { FollowListDialog } from '@/features/follows/components/follow-list-dialog';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  const [activeRotation, followCounts, ratingCount, streak] = await Promise.all(
    [
      getActiveRotation(user?.id),
      user
        ? getFollowCounts(user.id)
        : Promise.resolve({ followers: 0, following: 0 }),
      user
        ? prisma.rating.count({ where: { userId: user.id } })
        : Promise.resolve(0),
      user
        ? prisma.user.findUnique({
            where: { id: user.id },
            select: { rotationStreak: true },
          })
        : Promise.resolve(null),
    ]
  );

  const rotationStreak = streak?.rotationStreak ?? 0;

  return (
    <main className='bg-background max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
      <div className='flex flex-row items-center justify-between flex-wrap gap-3 mb-6'>
        <div>
          <h1 className='text-3xl font-title text-foreground'>
            {user ? (
              <>
                Welcome back,{' '}
                <span className='text-ember'>{user.name ?? user.username}</span>
              </>
            ) : (
              'Dashboard'
            )}
          </h1>
          {user && (
            <p className='text-sm text-text-secondary mt-2'>
              Here&apos;s what&apos;s happening this week.
            </p>
          )}
        </div>

        {user && (
          <Link
            href='/dashboard/rotations'
            className='flex items-center gap-2 rounded-md bg-ember text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity'
          >
            <IconRefresh size={16} />
            View rotation
          </Link>
        )}
      </div>

      {user && (
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mb-8'>
          <Link href='/dashboard/ratings'>
            <StatCard
              icon={<IconStar size={16} />}
              value={ratingCount}
              label='Albums rated'
            />
          </Link>
          <FollowListDialog
            userId={user.id}
            followerCount={followCounts.followers}
            followingCount={followCounts.following}
            isOwnProfile={true}
            initialTab='followers'
            trigger={
              <StatCard
                icon={<IconUsers size={16} />}
                value={followCounts.followers}
                label='Followers'
              />
            }
          />
          <FollowListDialog
            userId={user.id}
            followerCount={followCounts.followers}
            followingCount={followCounts.following}
            isOwnProfile={true}
            initialTab='following'
            trigger={
              <StatCard
                icon={<IconUserPlus size={16} />}
                value={followCounts.following}
                label='Following'
              />
            }
          />
          <StatCard
            icon={<IconFlame size={16} />}
            value={rotationStreak}
            label={rotationStreak === 1 ? 'Rotation streak' : 'Rotation streak'}
          />
        </div>
      )}

      <div className='rounded-xl border border-border bg-surface p-5 mb-8'>
        <CurrentRotationSection
          activeRotation={activeRotation}
          isSignedIn={!!user}
        />
      </div>

      {user && (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div className='rounded-md bg-surface border border-border p-4'>
            <p className='text-sm font-medium text-foreground mb-2'>
              Recently rated
            </p>
            <p className='text-xs text-text-secondary'>
              {/* TODO: wire up a "recent ratings" query */}
              Coming soon.
            </p>
          </div>

          <div className='rounded-md bg-surface border border-border p-4'>
            <p className='text-sm font-medium text-foreground mb-2'>
              From people you follow
            </p>
            <p className='text-xs text-text-secondary'>
              {/* TODO: wire up a following-activity feed query */}
              No activity yet.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className='rounded-md bg-surface border border-border p-3 hover:border-ember/40 transition-colors text-left'>
      <div className='flex items-center gap-1.5 text-ember mb-1'>{icon}</div>
      <p className='text-2xl font-title text-foreground leading-none'>
        {value}
      </p>
      <p className='text-xs text-text-secondary mt-1'>{label}</p>
    </div>
  );
}
