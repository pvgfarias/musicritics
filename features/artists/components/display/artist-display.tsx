'use client';

import { ArtistSummary } from '@/features/artists/queries';
import { ArtistList } from './artist-list';
import { ArtistGrid } from './artist-grid';

export default function ArtistDisplay({
  artistList,
  viewMode,
  renderCardActions,
}: {
  artistList: ArtistSummary[];
  viewMode: 'grid' | 'list';
  renderCardActions?: (artist: ArtistSummary) => React.ReactNode;
}) {
  return viewMode === 'list' ? (
    <div className='flex flex-col'>
      <ArtistList
        artistList={artistList}
        renderCardActions={renderCardActions}
      />
    </div>
  ) : (
    <div className='md:flex flex-col gap-4 w-full'>
      <ArtistGrid
        artistList={artistList}
        renderCardActions={renderCardActions}
      />
    </div>
  );
}
