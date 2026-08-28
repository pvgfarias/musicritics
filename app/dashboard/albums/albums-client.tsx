'use client';

import { Suspense, useState } from 'react';
import AlbumDisplay from '@/components/albums/display/album-display';
import AlbumStatus from '@/components/albums/album-status';
import GenreSelector from '@/components/ui/genre-selector';
import SearchBar from '@/components/ui/search-bar';
import SortSelector from '@/components/ui/sort-selector';
import type { AlbumSummary } from '@/data/albums';
import type { User } from '@/lib/auth';
import ViewMode from '@/components/ui/view-mode';
import Pagination from '@/components/ui/pagination';

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
          <ViewMode viewMode={viewMode} onViewModeChange={setViewMode} />
        </Suspense>
        {toolbarExtra}
      </div>

      <AlbumDisplay
        albumList={albums}
        viewMode={viewMode}
        renderCardActions={renderCardActions}
      />

      <Suspense>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
