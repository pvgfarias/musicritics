'use client';

import { ArtistSummary } from '@/data/artists';
import { User } from '@/lib/auth';
import { ArtistList } from './artist-list';
import { ArtistGrid } from './artist-grid';

export default function ArtistDisplay({
  artistList,
  viewMode,
  renderCardActions,
  user,
}: {
  artistList: ArtistSummary[];
  viewMode: 'grid' | 'list';
  renderCardActions?: (artist: ArtistSummary) => React.ReactNode;
  user?: User;
}) {
  return viewMode === 'list' ? (
    <div className='flex flex-col'>
      <ArtistList
        artistList={artistList}
        renderCardActions={renderCardActions}
        user={user}
      />
    </div>
  ) : (
    <div className='md:flex flex-col gap-4 w-full'>
      <ArtistGrid
        artistList={artistList}
        renderCardActions={renderCardActions}
        user={user}
      />
    </div>
  );
}
