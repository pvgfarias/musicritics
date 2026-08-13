'use client';

import { useSearchParams } from 'next/navigation';
import { SortKey } from '@/lib/sort-ratings';
import { useAlbumFilters } from '@/hooks/use-album-filters';
import { AlbumList } from './album-list';
import { AlbumGrid } from './album-grid';
import type { AlbumSummary } from '@/data/albums';
import type { RefObject } from 'react';

export default function AlbumDisplay({
  albumList,
  viewMode,
  hasMore,
  isLoadingMore,
  sentinelRef,
}: {
  albumList: AlbumSummary[];
  viewMode: 'grid' | 'list';
  hasMore: boolean;
  isLoadingMore: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
}) {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const genre = searchParams.get('genre');
  const status = searchParams.get('status');
  const sort = (searchParams.get('sort') as SortKey) ?? 'recent';

  const filteredAlbums = useAlbumFilters(albumList, {
    query,
    genre,
    status,
    sort,
  });
  const filterKey = `${query}|${genre}|${status}|${sort}`;

  return viewMode === 'list' ? (
    <div key={filterKey} className='flex flex-col gap-2'>
      <AlbumList
        albumList={filteredAlbums}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        sentinelRef={sentinelRef}
      />
    </div>
  ) : (
    <div key={filterKey} className='md:flex flex-col gap-4 w-full'>
      <AlbumGrid
        albumList={filteredAlbums}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        sentinelRef={sentinelRef}
      />
    </div>
  );
}
