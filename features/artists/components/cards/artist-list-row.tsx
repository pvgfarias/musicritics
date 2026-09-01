import RatingGrade from '@/components/dashboard/rating-grade';
import { ArtistSummary } from '@/features/artists/queries';
import Image from 'next/image';
import { ARTIST_ROW_GRID } from '../display/artist-list';

export default function ArtistListRow({
  artist,
  actions,
}: {
  artist: ArtistSummary;
  actions?: React.ReactNode;
}) {
  return (
    <div
      key={artist.id}
      className='group border-b border-gray-300 dark:border-slate-800
            cursor-pointer
            transition-colors duration-150
            hover:bg-gray-100 dark:hover:bg-slate-900'
    >
      <div className={`${ARTIST_ROW_GRID} p-2`}>
        <div className='relative w-12.5 h-12.5 shrink-0 overflow-hidden rounded-sm'>
          <Image
            src={
              artist.image?.includes('http')
                ? `${artist.image}`
                : `/${artist.image}`
            }
            alt={`${artist.name}`}
            fill
            className='object-cover transition-transform duration-200 group-hover:scale-105'
          />
        </div>

        <p className='font-title font-bold text-sm text-dark-blue dark:text-white line-clamp-1 transition-colors duration-150 group-hover:text-orange-500'>
          {artist.name}
        </p>

        <span className='text-center text-gray-500 dark:text-gray-300'>
          {artist.albumsCount}
        </span>

        <div className='flex justify-center'>
          <RatingGrade ratingGrade={artist.userAverageRating} size='sm' />
        </div>

        <div className='flex justify-center'>
          <RatingGrade ratingGrade={artist.averageRating} size='sm' />
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
