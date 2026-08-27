'use client';

import { Suspense, useState } from 'react';
import AlbumViewMode from '@/components/albums/album-view-mode';
import AlbumDisplay from '@/components/albums/display/album-display';
import AlbumPagination from '@/components/albums/album-pagination';
import AlbumStatus from '@/components/albums/album-status';
import GenreSelector from '@/components/ui/genre-selector';
import SearchBar from '@/components/ui/search-bar';
import SortSelector from '@/components/ui/sort-selector';
import type { AlbumSummary } from '@/data/albums';
import type { User } from '@/lib/auth';

type AlbumsClientProps = {
  albums: AlbumSummary[];
  currentPage: number;
  totalPages: number;
  renderCardActions?: (album: AlbumSummary) => React.ReactNode;
  toolbarExtra?: React.ReactNode;
  user?: User;
};

export default function AlbumsClient({
  albums,
  currentPage,
  totalPages,
  renderCardActions,
  toolbarExtra,
  user,
}: AlbumsClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div>
      <div className='flex flex-row justify-start items-center gap-2 md:gap-4 mb-2'>
        <Suspense>
          <SearchBar />
          <GenreSelector />
          <SortSelector />
          <AlbumStatus />
          <AlbumViewMode viewMode={viewMode} onViewModeChange={setViewMode} />
        </Suspense>
        {toolbarExtra}
      </div>

      <AlbumDisplay
        albumList={albums}
        viewMode={viewMode}
        renderCardActions={renderCardActions}
        user={user}
      />

      <Suspense>
        <AlbumPagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
