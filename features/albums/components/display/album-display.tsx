'use client';

import { AlbumList } from './album-list';
import { AlbumGrid } from './album-grid';
import type { AlbumSummary } from '@/features/albums/queries';

export default function AlbumDisplay({
  albumList,
  viewMode,
  renderCardActions,
}: {
  albumList: AlbumSummary[];
  viewMode: 'grid' | 'list';
  renderCardActions?: (album: AlbumSummary) => React.ReactNode;
}) {
  return viewMode === 'list' ? (
    <div className='flex flex-col'>
      <AlbumList albumList={albumList} renderCardActions={renderCardActions} />
    </div>
  ) : (
    <div className='md:flex flex-col gap-4 w-full'>
      <AlbumGrid albumList={albumList} renderCardActions={renderCardActions} />
    </div>
  );
}
