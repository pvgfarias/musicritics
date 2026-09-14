import Link from 'next/link';
import {
  IconCalendar,
  IconDisc,
  IconUser,
  IconWorld,
  IconMessageCircle,
} from '@tabler/icons-react';
import RatingListRow, { RATING_ROW_GRID } from '../cards/rating-list-row';
import type { RatedAlbum } from '@/features/ratings/queries';

export function RatingsList({ albums }: { albums: RatedAlbum[] }) {
  return (
    <div className='flex flex-col border-b border-gray-300 dark:border-slate-800 gap-1'>
      <div
        className={`${RATING_ROW_GRID} border-b px-2 py-1 border-gray-300 dark:border-slate-800 text-gray-500 dark:text-gray-300 font-mono text-sm`}
      >
        <div />
        <div className='flex flex-row items-center gap-1.5'>
          <IconDisc size={16} /> ALBUM
        </div>
        <div className='flex flex-row items-center justify-center gap-1.5'>
          <IconCalendar size={16} /> RATED
        </div>
        <div className='flex flex-row items-center justify-center gap-1.5'>
          <IconUser size={16} /> YOU
        </div>
        <div className='flex flex-row items-center justify-center gap-1.5'>
          <IconWorld size={16} /> PUBLIC
        </div>
        <div className='flex flex-row items-center justify-center'>
          <IconMessageCircle size={16} />
        </div>
      </div>

      {albums.map(album => (
        <Link
          key={album.id}
          href={`/dashboard/albums/${album.slug}`}
          className='w-full'
        >
          <RatingListRow album={album} />
        </Link>
      ))}
      <div />
    </div>
  );
}
