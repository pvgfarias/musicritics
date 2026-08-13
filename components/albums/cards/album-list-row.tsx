import { AlbumSummary } from '@/data/albums';
import Image from 'next/image';
import RatingGrade from '../../dashboard/rating-grade';

export default function AlbumListRow({ album }: { album: AlbumSummary }) {
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
            src={album.coverImage ? `/${album.coverImage}` : '/albums.jpg'}
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
            {album.releaseYear}
          </span>

          {album.averageRating && (
            <RatingGrade ratingGrade={album.averageRating} inAlbum={false} />
          )}
        </div>
      </div>
    </div>
  );
}
