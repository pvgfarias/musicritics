'use client';

import Link from 'next/link';
import { IconRefresh } from '@tabler/icons-react';
import type { ActiveRotation } from '@/features/rotations/queries';
import { formatDateRange } from '@/lib/format';
import CurrentRotationAlbumCard from './current-rotation-album-card';

export default function CurrentRotationSection({
  activeRotation,
  isSignedIn,
}: {
  activeRotation: ActiveRotation;
  isSignedIn: boolean;
}) {
  if (!activeRotation) {
    return (
      <section className='mb-10'>
        <p className='font-mono text-sm text-gray-500 dark:text-gray-400'>
          No rotation is currently active. Check back soon.
        </p>
      </section>
    );
  }

  const ratedCount = activeRotation.albums.filter(
    a => a.userRating != null
  ).length;
  const total = activeRotation.albumCount;
  const percent = total > 0 ? Math.round((ratedCount / total) * 100) : 0;

  return (
    <section className='mb-10 flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between flex-wrap gap-2'>
        <div className='flex flex-col gap-1'>
          <span className='font-mono text-xs text-ember tracking-[0.2em] uppercase flex items-center gap-1.5'>
            <IconRefresh size={12} /> Current Rotation
          </span>
          <h2 className='text-2xl font-title text-gray-950 dark:text-white'>
            {activeRotation.name}
          </h2>
          <p className='font-mono text-xs text-gray-600 dark:text-gray-400'>
            {formatDateRange(activeRotation.startDate, activeRotation.endDate)}
          </p>
        </div>

        {isSignedIn ? (
          <div className='flex flex-col gap-1.5 w-full sm:w-64'>
            <span className='font-mono text-xs text-gray-600 dark:text-gray-300 uppercase tracking-widest'>
              {ratedCount} of {total} rated
            </span>
            <div className='h-2 w-full rounded-full bg-gray-200 dark:bg-slate-800 overflow-hidden'>
              <div
                className='h-full bg-emerald-500 transition-all duration-300'
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        ) : (
          <p className='font-mono text-xs text-gray-500 dark:text-gray-400'>
            <Link href='/sign-in' className='text-ember hover:underline'>
              Sign in
            </Link>{' '}
            to rate this week&apos;s albums.
          </p>
        )}
      </div>

      {activeRotation.albums.length > 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
          {activeRotation.albums.map(album => (
            <CurrentRotationAlbumCard key={album.id} album={album} />
          ))}
        </div>
      ) : (
        <p className='font-mono text-sm text-gray-500 dark:text-gray-400'>
          No albums have been added to this rotation yet.
        </p>
      )}
    </section>
  );
}
