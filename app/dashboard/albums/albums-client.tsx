'use client';

import { useState } from 'react';

import AlbumViewMode from '@/components/albums/album-view-mode';
import type { AlbumSummary } from '@/data/albums';
import AlbumStatus from '@/components/albums/album-status';
import GenreSelector from '@/components/ui/genre-selector';
import SearchBar from '@/components/ui/search-bar';
import SortSelector from '@/components/ui/sort-selector';
import { Suspense } from 'react';
import AlbumDisplay from '@/components/albums/album-display';

type AlbumsClientProps = {
  albums: AlbumSummary[];
};

export default function AlbumsClient({ albums }: AlbumsClientProps) {
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
      </div>
      <AlbumDisplay albumList={albums} viewMode={viewMode} />
    </div>
  );
}
