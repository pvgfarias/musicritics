'use client';

import { AlbumList } from './album-list';
import { AlbumGrid } from './album-grid';
import type { AlbumSummary } from '@/data/albums';
import type { User } from '@/lib/auth';

export default function AlbumDisplay({
  albumList,
  viewMode,
  renderCardActions,
  user,
}: {
  albumList: AlbumSummary[];
  viewMode: 'grid' | 'list';
  renderCardActions?: (album: AlbumSummary) => React.ReactNode;
  user?: User;
}) {
  return viewMode === 'list' ? (
    <div className='flex flex-col'>
      <AlbumList
        albumList={albumList}
        renderCardActions={renderCardActions}
        user={user}
      />
    </div>
  ) : (
    <div className='md:flex flex-col gap-4 w-full'>
      <AlbumGrid
        albumList={albumList}
        renderCardActions={renderCardActions}
        user={user}
      />
    </div>
  );
}
