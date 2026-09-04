import { AlbumSummary } from '@/features/albums/queries';
import Image from 'next/image';
import RatingScore from '@/components/dashboard/rating-score';
import { IconClock } from '@tabler/icons-react';
import { ALBUM_ROW_GRID } from '../display/album-list';

export default function AlbumListRow({
  album,
  actions,
}: {
  album: AlbumSummary;
  actions?: React.ReactNode;
}) {
  return (
    <div
      key={album.id}
      className='group border-b border-gray-300 dark:border-slate-800
            cursor-pointer
            transition-colors duration-150
            hover:bg-gray-100 dark:hover:bg-slate-900'
    >
      <div className={`${ALBUM_ROW_GRID} p-2`}>
        <div className='relative w-12.5 h-12.5 shrink-0 overflow-hidden rounded-sm'>
          <Image
            src={album.coverImage ?? '/albums.jpg'}
            alt={`${album.title} by ${album.artists[0]?.artist.name}`}
            fill
            className='object-cover transition-transform duration-200 group-hover:scale-105'
          />
        </div>

        <div className='flex flex-col grow'>
          <p className='font-title font-bold text-sm text-dark-blue dark:text-white line-clamp-1 transition-colors duration-150 group-hover:text-orange-500'>
            {album.title}
          </p>

          <p className='text-[13px] text-gray-700 dark:text-gray-300 line-clamp-1'>
            {album.artists[0]?.artist.name}
          </p>
        </div>

        <span className='text-center text-sm text-gray-500 dark:text-slate-400'>
          {album.releaseDate?.getFullYear()}
        </span>

        <span className='text-center text-sm text-gray-500 dark:text-slate-400'>
          {album.ratingCount}
        </span>

        <div className='flex justify-center'>
          {album.userRating ? (
            <RatingScore ratingScore={album.userRating} size='sm' />
          ) : (
            <span className='text-gray-500 dark:text-slate-400'>—</span>
          )}
        </div>

        <div className='flex justify-center text-gray-600 dark:text-white'>
          {!album.openForRatings && album.averageRating ? (
            <RatingScore ratingScore={album.averageRating} size='sm' />
          ) : album.openForRatings ? (
            <span className='text-gray-500 dark:text-slate-400'>-</span>
          ) : (
            <IconClock size={14} className='text-gray-500' />
          )}
        </div>

        {actions && (
          <div
            className='flex flex-row gap-2 items-center justify-end shrink-0'
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
