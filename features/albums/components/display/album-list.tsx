import type { AlbumSummary } from '@/features/albums/queries';
import AlbumListRow from '../cards/album-list-row';
import Link from 'next/link';
import {
  IconCalendar,
  IconDisc,
  IconStar,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';

export const ALBUM_ROW_GRID =
  'grid grid-cols-[3rem_1fr_4.5rem_5rem_4.5rem_4.5rem_2.5rem] items-center gap-4';

export function AlbumList({
  albumList,
  renderCardActions,
}: {
  albumList: AlbumSummary[];
  renderCardActions?: (album: AlbumSummary) => React.ReactNode;
}) {
  return (
    <div className='flex flex-col border-b border-gray-300 dark:border-slate-800 gap-1'>
      <div
        className={`${ALBUM_ROW_GRID} border-b px-2 py-1 border-gray-300 dark:border-slate-800 text-gray-500 dark:text-gray-300 font-mono text-sm`}
      >
        <div />

        <div className='flex flex-row items-center gap-1.5'>
          <IconDisc size={16} /> ALBUM
        </div>
        <div className='flex flex-row items-center justify-center gap-1.5'>
          <IconCalendar size={16} /> YEAR
        </div>
        <div className='flex flex-row items-center justify-center gap-1.5'>
          <IconStar size={16} /> RATINGS
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
      {albumList.map(album => (
        <Link
          key={album.id}
          href={`/dashboard/albums/${album.slug}`}
          className='w-full'
        >
          <AlbumListRow
            key={album.id}
            album={album}
            actions={renderCardActions?.(album)}
          />
        </Link>
      ))}
      <div />
    </div>
  );
}
