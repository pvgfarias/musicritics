'use client';

import { useState } from 'react';

import AlbumViewMode from '@/components/albums/album-view-mode';
import CardGrid from '@/components/ui/card-grid';
import type { AlbumSummary } from '@/data/albums';
import AlbumStatus from '@/components/albums/album-status';
import GenreSelector from '@/components/ui/genre-selector';
import SearchBar from '@/components/ui/search-bar';
import SortSelector from '@/components/ui/sort-selector';
import { Suspense } from 'react';

type AlbumsClientProps = {
  albums: AlbumSummary[];
  maxAlbums: number;
};

export default function AlbumsClient({ albums, maxAlbums }: AlbumsClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div>
      <div className='flex flex-row justify-start items-center gap-2 md:gap-4 mb-4'>
        <Suspense>
          <SearchBar />
          <GenreSelector />
          <SortSelector />
          <AlbumStatus />
        </Suspense>

        <AlbumViewMode viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>
      <CardGrid cardsList={albums} MAX_CARDS={maxAlbums} viewMode={viewMode} />
    </div>
  );
}
