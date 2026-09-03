import RatingScore from '@/components/dashboard/rating-score';
import { ArtistSummary } from '@/features/artists/queries';
import { IconDisc, IconUser, IconWorld } from '@tabler/icons-react';
import Image from 'next/image';

export default function ArtistCard({
  artist,
  priority = false,
  actions,
}: {
  artist: ArtistSummary;
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
          src={artist.image ?? '/artists.jpg'}
          alt={`${artist.name}`}
          fill
          sizes='224px'
          className='object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]'
          priority={priority}
        />
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
      <div className='flex flex-col gap-1 p-2.5'>
        <p className='font-title font-bold text-sm text-dark-blue dark:text-white line-clamp-1 transition-colors duration-200 group-hover:text-orange-500'>
          {artist.name}
        </p>

        <div className='flex flex-row gap-2'>
          <div className='flex flex-row justify-center items-center gap-1 text-dark-blue dark:text-white'>
            <IconDisc size={16} />
            <p className='font-title font-bold text-sm'>{artist.albumsCount}</p>
          </div>
          <div className='flex flex-row justify-center items-center gap-1 text-dark-blue dark:text-white'>
            <IconWorld size={16} />
            <RatingScore ratingScore={artist.averageRating} size='sm' />
          </div>
          <div className='flex flex-row justify-center items-center gap-1 text-dark-blue dark:text-white'>
            <IconUser size={16} />
            <RatingScore ratingScore={artist.userAverageRating} size='sm' />
          </div>
        </div>
      </div>
    </div>
  );
}
