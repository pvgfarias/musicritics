import { AlbumSummary } from '@/data/albums';
import Image from 'next/image';
import RatingGrade from '../../dashboard/rating-grade';
import type { User } from '@/lib/auth';
import { IconClock, IconUser, IconWorld } from '@tabler/icons-react';

export default function AlbumListRow({
  album,
  actions,
  user,
}: {
  album: AlbumSummary;
  actions?: React.ReactNode;
  user?: User;
}) {
  const userRating = user
    ? album.ratings.find(rating => rating.user.id === user.id)
    : undefined;

  return (
    <div
      key={album.id}
      className='group border-b border-gray-300 dark:border-slate-800
            cursor-pointer
            transition-colors duration-150
            hover:bg-gray-100 dark:hover:bg-slate-900'
    >
      <div className='flex flex-row justify-start items-center gap-2 p-2'>
        <div className='relative w-12.5 h-12.5 shrink-0 overflow-hidden rounded-sm'>
          <Image
            src={
              album.coverImage?.includes('http')
                ? `${album.coverImage}`
                : `/${album.coverImage}`
            }
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

          <p className='text-xs text-gray-700 dark:text-gray-300 line-clamp-1'>
            {album.ratingCount} ratings.
          </p>
        </div>

        <div className='flex flex-row gap-6 items-center'>
          <span className='text-sm text-gray-500 dark:text-slate-400'>
            {album.releaseDate?.getFullYear()}
          </span>

          <div className='flex flex-col justify-center items-center gap-1.5 w-4'>
            <IconUser size={16} className='text-gray-600 dark:text-gray-400' />
            <span className='font-mono text-xs text-gray-500'>
              {userRating?.score ? (
                <RatingGrade ratingGrade={userRating.score} size='sm' />
              ) : (
                '—'
              )}
            </span>
          </div>

          <div className='flex flex-row items-center gap-2.5 w-4'>
            <div className='flex flex-col justify-center items-center gap-1'>
              <IconWorld
                size={16}
                className='text-gray-600 dark:text-gray-400'
              />
              <span className='text-gray-600 dark:text-white'>
                {album.finalized && album.averageRating ? (
                  <RatingGrade ratingGrade={album.averageRating} size='sm' />
                ) : album.finalized ? (
                  '-'
                ) : (
                  <IconClock size={14} className='text-gray-500 mt-1' />
                )}
              </span>
            </div>
          </div>
        </div>
        {actions && (
          <div
            className='flex flex-row gap-2 items-center shrink-0 ml-2'
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
