import { ArtistSummary } from '@/data/artists';
import Link from 'next/link';
import ArtistListRow from '../cards/artist-list-row';
import {
  IconDisc,
  IconMicrophone2,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';

export const ARTIST_ROW_GRID =
  'grid grid-cols-[3rem_1fr_4.5rem_4.5rem_4.5rem_2.5rem] items-center gap-4';

export function ArtistList({
  artistList,
  renderCardActions,
}: {
  artistList: ArtistSummary[];
  renderCardActions?: (artist: ArtistSummary) => React.ReactNode;
}) {
  return (
    <div className='flex flex-col border-b border-gray-300 dark:border-slate-800 gap-1'>
      <div
        className={`${ARTIST_ROW_GRID} border-b px-2 py-1 border-gray-300 dark:border-slate-800 text-gray-500 dark:text-gray-300 font-mono text-sm`}
      >
        <div />
        <div className='flex flex-row items-center gap-1.5'>
          <IconMicrophone2 size={16} /> ARTIST
        </div>
        <div className='flex flex-row items-center justify-center gap-1.5'>
          <IconDisc size={16} /> ALBUMS
        </div>
        <div className='flex flex-row items-center justify-center gap-1.5'>
          <IconUser size={16} />
          USER
        </div>
        <div className='flex flex-row items-center justify-center gap-1.5'>
          <IconWorld size={16} />
          PUBLIC
        </div>
        <div />
      </div>

      {artistList.map(artist => (
        <Link
          key={artist.id}
          href={`/dashboard/artists/${artist.slug}`}
          className='w-full'
        >
          <ArtistListRow
            key={artist.id}
            artist={artist}
            actions={renderCardActions?.(artist)}
          />
        </Link>
      ))}
    </div>
  );
}
