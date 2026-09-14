'use client';

import { RatingsList } from './ratings-list';
import { RatingsGrid } from './ratings-grid';
import type { RatedAlbum } from '@/features/ratings/queries';

export default function RatingsDisplay({
  albums,
  viewMode,
}: {
  albums: RatedAlbum[];
  viewMode: 'grid' | 'list';
}) {
  return viewMode === 'list' ? (
    <div className='flex flex-col'>
      <RatingsList albums={albums} />
    </div>
  ) : (
    <div className='md:flex flex-col gap-4 w-full'>
      <RatingsGrid albums={albums} />
    </div>
  );
}
