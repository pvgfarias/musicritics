import Link from 'next/link';
import {
  IconStar,
  IconDisc,
  IconRefresh,
  IconUsers,
  IconUserPlus,
} from '@tabler/icons-react';
import { auth } from '@/features/auth/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getFollowCounts } from '@/features/follows/queries';
import { getActiveRotation } from '@/features/rotations/queries';
import CurrentRotationSection from '@/features/rotations/components/current-rotation-section';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  // No redirect — a logged-out visitor still gets the page, just without
  // the personalized sections below. `user ? ... : ...` ternaries here
  // keep the fetches type-safe without needing `user!` anywhere.
  const [activeRotation, followCounts, ratingCount] = await Promise.all([
    getActiveRotation(user?.id),
    user
      ? getFollowCounts(user.id)
      : Promise.resolve({ followers: 0, following: 0 }),
    user
      ? prisma.rating.count({ where: { userId: user.id } })
      : Promise.resolve(0),
  ]);

  return (
    <main className='bg-background max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <h1 className='text-3xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-6'>
        {user ? `Welcome back, ${user.name ?? user.username}` : 'Dashboard'}
      </h1>

      {user && (
        <div className='grid grid-cols-3 sm:grid-cols-3 gap-3 max-w-2xl'>
          <StatCard
            icon={<IconStar size={16} />}
            value={ratingCount}
            label='Albums rated'
          />
          <StatCard
            icon={<IconUsers size={16} />}
            value={followCounts.followers}
            label='Followers'
          />
          <StatCard
            icon={<IconUserPlus size={16} />}
            value={followCounts.following}
            label='Following'
          />
        </div>
      )}

      {user && (
        <>
          <div className='h-px bg-gray-300 dark:bg-slate-800 w-full mb-6' />

          <div className='flex flex-row flex-wrap gap-3 mb-8'>
            <Link
              href='/dashboard/ratings'
              className='flex items-center gap-2.5 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-4 py-2.5 hover:border-ember dark:hover:border-ember transition-colors'
            >
              <span className='flex items-center justify-center w-7 h-7 rounded-full bg-ember/10 text-ember'>
                <IconStar size={15} />
              </span>
              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                Your ratings
              </span>
            </Link>

            <Link
              href='/dashboard/albums'
              className='flex items-center gap-2.5 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-4 py-2.5 hover:border-ember dark:hover:border-ember transition-colors'
            >
              <span className='flex items-center justify-center w-7 h-7 rounded-full bg-ember/10 text-ember'>
                <IconDisc size={15} />
              </span>
              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                Browse albums
              </span>
            </Link>

            <Link
              href='/dashboard/rotations'
              className='flex items-center gap-2.5 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-4 py-2.5 hover:border-ember dark:hover:border-ember transition-colors'
            >
              <span className='flex items-center justify-center w-7 h-7 rounded-full bg-ember/10 text-ember'>
                <IconRefresh size={15} />
              </span>
              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                Weekly rotation
              </span>
            </Link>
          </div>
        </>
      )}

      <CurrentRotationSection
        activeRotation={activeRotation}
        isSignedIn={!!user}
      />
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
    <div className='rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-3 hover:border-ember/40 dark:hover:border-ember/40 transition-colors'>
      <div className='flex items-center gap-1.5 text-ember mb-1'>{icon}</div>
      <p className='text-2xl font-title text-gray-900 dark:text-white leading-none'>
        {value}
      </p>
      <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>{label}</p>
    </div>
  );
}
