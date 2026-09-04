'use client';

import { Suspense, useState } from 'react';
import AlbumDisplay from './display/album-display';
import FiltersPanel from './album-filters-panel';
import SearchBar from '@/components/ui/search-bar';
import SortSelector from '@/components/ui/sort-selector';
import type { AlbumSummary } from '@/features/albums/queries';
import type { User } from '@/features/auth/auth';
import ViewMode from '@/components/ui/view-mode';
import Pagination from '@/components/ui/pagination';

type Genre = { name: string; slug: string };

type AlbumsClientProps = {
  albums: AlbumSummary[];
  genres: Genre[];
  currentPage: number;
  totalPages: number;
  renderCardActions?: (album: AlbumSummary) => React.ReactNode;
  toolbarExtra?: React.ReactNode;
  user?: User;
  isLoggedIn: boolean;
};

export default function AlbumsClient({
  albums,
  genres,
  currentPage,
  totalPages,
  renderCardActions,
  toolbarExtra,
  isLoggedIn,
}: AlbumsClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div>
      <div className='flex flex-row justify-start items-center gap-2 md:gap-4 mb-2'>
        <Suspense>
          <SearchBar />
          <SortSelector />
          <div className='ml-auto flex flex-row items-center gap-2 md:gap-4'>
            <FiltersPanel genres={genres} isLoggedIn={isLoggedIn} />
            <ViewMode viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
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
