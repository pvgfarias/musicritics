import Image from 'next/image';
import RatingGrade from '@/components/dashboard/rating-grade';
import type { AlbumSummary } from '@/features/albums/queries';
import { IconRefresh, IconUser, IconWorld } from '@tabler/icons-react';

export default function AlbumCard({
  album,
  priority = false,
  actions,
}: {
  album: AlbumSummary;
  priority: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div
      className='group flex flex-col w-full shrink-0 cursor-pointer rounded-sm mb-2
        transition-all duration-200 ease-out
        hover:-translate-y-1.5 hover:shadow-lg
        bg-transparent hover:bg-gray-100 dark:hover:bg-slate-900'
    >
      <div className='relative w-56 aspect-square shrink-0 overflow-hidden rounded-t-sm'>
        <Image
          src={
            album.coverImage?.includes('http')
              ? `${album.coverImage}`
              : `/${album.coverImage}`
          }
          alt={`${album.title} by ${album.artists[0]?.artist.name}`}
          fill
          className='object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]'
          priority={priority}
        />
        {!album.finalized && (
          <div className='absolute flex justify-center items-center gap-2 bg-ember font-mono text-gray-200 px-1.5 py-0.5 text-[10px] rounded-md bottom-2 right-2 uppercase'>
            <IconRefresh size={10} /> Weekly Rotation
          </div>
        )}
        {actions && (
          <div
            className='absolute top-2 left-1 flex gap-1 z-10 cursor-pointer'
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {actions}
          </div>
        )}
      </div>

      <div className='flex flex-col p-2.5 justify-start gap-0.5 flex-1'>
        <p className='font-title font-bold text-sm text-dark-blue dark:text-white line-clamp-1 transition-colors duration-200 group-hover:text-orange-500'>
          {album.title}
        </p>

        <p className='text-[13px] text-gray-700 dark:text-gray-300 line-clamp-1'>
          {album.artists[0]?.artist.name}
        </p>

        <div className='flex flex-row gap-2'>
          <div className='flex flex-row justify-center items-center gap-1 text-gray-800 dark:text-gray-200 rounded-md px-1'>
            <IconUser size={16} />

            {album.userRating != null && (
              <RatingGrade ratingGrade={album.userRating} size='sm' />
            )}
          </div>

          {album.finalized && album.averageRating != null && (
            <div className='flex flex-row justify-center items-center gap-1 bg-foreground text-gray-800 dark:text-gray-200 rounded-md px-0.5'>
              <IconWorld size={16} />
              <RatingGrade ratingGrade={album.averageRating} size='sm' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
