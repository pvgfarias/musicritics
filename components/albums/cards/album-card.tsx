import Image from 'next/image';
import RatingGrade from '../../dashboard/rating-grade';
import type { AlbumSummary } from '@/data/albums';

export default function AlbumCard({
  album,
  priority = false,
}: {
  album: AlbumSummary;
  priority: boolean;
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
          src={album.coverImage ? `/${album.coverImage}` : '/albums.jpg'}
          alt={`${album.title} by ${album.artists[0]?.artist.name}`}
          fill
          className='object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]'
          priority={priority}
        />

        {album.averageRating && (
          <RatingGrade ratingGrade={album.averageRating} inAlbum={true} />
        )}
      </div>

      <div className='flex flex-col p-2.5 justify-start gap-0.5 flex-1'>
        <p className='font-title font-bold text-sm text-dark-blue dark:text-white line-clamp-1 transition-colors duration-200 group-hover:text-orange-500'>
          {album.title}
        </p>

        <p className='text-[13px] text-gray-700 dark:text-gray-300 line-clamp-1'>
          {album.artists[0]?.artist.name}
        </p>

        <p className='text-xs text-gray-700 dark:text-gray-300 line-clamp-1'>
          {album.ratingCount} ratings.
        </p>
      </div>
    </div>
  );
}
