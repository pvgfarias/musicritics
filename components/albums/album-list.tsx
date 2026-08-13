import Image from 'next/image';
import RatingGrade from '../dashboard/rating-grade';
import type { AlbumSummary } from '@/data/albums';

export function AlbumList({ albumList }: { albumList: AlbumSummary[] }) {
  return (
    <>
      {albumList.map(album => (
        <div
          key={album.id}
          className='border-b border-gray-300 dark:border-slate-800'
        >
          <div className='flex flex-row justify-start items-center gap-2 p-2'>
            <Image
              src={album.coverImage ? `/${album.coverImage}` : '/albums.jpg'}
              alt={`${album.title} by ${album.artists[0]?.artist.name}`}
              width={50}
              height={50}
              className='rounded-sm object-cover'
            />
            <div className='flex flex-col grow'>
              <p className='font-title font-bold text-sm text-dark-blue dark:text-white line-clamp-1'>
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
                <RatingGrade
                  ratingGrade={album.averageRating}
                  inAlbum={false}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
