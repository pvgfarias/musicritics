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
        <div className='flex flex-col items-center gap-2 text-center py-10 px-4 rounded-md bg-surface border border-border'>
          <IconRefresh size={22} className='text-text-secondary' />
          <p className='text-sm text-foreground'>
            No rotation is currently active.
          </p>
          <p className='text-xs text-text-secondary'>
            Check back soon — the next one opens shortly.
          </p>
        </div>
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
          <span className='font-mono text-xs text-text-secondary tracking-[0.2em] uppercase flex items-center gap-1.5'>
            <IconRefresh size={12} className='text-ember' /> Current Rotation
          </span>
          <h2 className='text-2xl font-title text-foreground'>
            {activeRotation.name}
          </h2>
          <p className='font-mono text-xs text-text-secondary'>
            {formatDateRange(activeRotation.startDate, activeRotation.endDate)}
          </p>
        </div>

        {isSignedIn ? (
          <div className='flex flex-col gap-1.5 w-full sm:w-64'>
            <span className='font-mono text-xs text-text-secondary uppercase tracking-widest'>
              {ratedCount} of {total} rated
            </span>
            <div className='h-2 w-full rounded-full bg-border overflow-hidden'>
              <div
                className='h-full bg-emerald-500 transition-all duration-300'
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        ) : (
          <p className='font-mono text-xs text-text-secondary'>
            <Link href='/login' className='text-ember hover:underline'>
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
        <p className='font-mono text-sm text-text-secondary'>
          No albums have been added to this rotation yet.
        </p>
      )}
    </section>
  );
}
