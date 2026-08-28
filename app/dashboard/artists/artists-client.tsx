'use client';

import ArtistDisplay from '@/components/artists/display/artist-display';
import Pagination from '@/components/ui/pagination';
import SearchBar from '@/components/ui/search-bar';
import SortSelector from '@/components/ui/sort-selector';
import ViewMode from '@/components/ui/view-mode';
import { ArtistSummary } from '@/data/artists';
import { Suspense, useState } from 'react';

type ArtistsClientProps = {
  artists: ArtistSummary[];
  currentPage: number;
  totalPages: number;
  renderCardActions?: (artist: ArtistSummary) => React.ReactNode;
  toolbarExtra?: React.ReactNode;
};

export default function ArtistsClient({
  artists,
  currentPage,
  totalPages,
  renderCardActions,
  toolbarExtra,
}: ArtistsClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div>
      <div className='flex flex-row justify-start items-center gap-2 md:gap-4 mb-2'>
        <Suspense>
          <SearchBar />
          <SortSelector />
          <ViewMode viewMode={viewMode} onViewModeChange={setViewMode} />
        </Suspense>
        {toolbarExtra}
      </div>

      <ArtistDisplay
        artistList={artists}
        viewMode={viewMode}
        renderCardActions={renderCardActions}
      />

      <Suspense>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
