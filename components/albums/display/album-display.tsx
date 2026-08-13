'use client';

import { AlbumList } from './album-list';
import { AlbumGrid } from './album-grid';
import type { AlbumSummary } from '@/data/albums';

export default function AlbumDisplay({
  albumList,
  viewMode,
}: {
  albumList: AlbumSummary[];
  viewMode: 'grid' | 'list';
}) {
  return viewMode === 'list' ? (
    <div className='flex flex-col gap-2'>
      <AlbumList albumList={albumList} />
    </div>
  ) : (
    <div className='md:flex flex-col gap-4 w-full'>
      <AlbumGrid albumList={albumList} />
    </div>
  );
}
