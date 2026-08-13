// albums-client.tsx
'use client';

import { Suspense } from 'react';
import AlbumViewMode from '@/components/albums/album-view-mode';
import AlbumDisplay from '@/components/albums/album-display';
import AlbumStatus from '@/components/albums/album-status';
import GenreSelector from '@/components/ui/genre-selector';
import SearchBar from '@/components/ui/search-bar';
import SortSelector from '@/components/ui/sort-selector';
import { useInfiniteAlbums } from '@/hooks/use-infinite-albums';
import { useState } from 'react';
import type { AlbumSummary } from '@/data/albums';

type AlbumsClientProps = {
  initialAlbums: AlbumSummary[];
  initialHasMore: boolean;
  pageSize: number;
};

export default function AlbumsClient({
  initialAlbums,
  initialHasMore,
  pageSize,
}: AlbumsClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { albums, hasMore, isLoadingMore, sentinelRef } = useInfiniteAlbums(
    initialAlbums,
    initialHasMore,
    pageSize
  );

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
      <AlbumDisplay
        albumList={albums}
        viewMode={viewMode}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        sentinelRef={sentinelRef}
      />
    </div>
  );
}
