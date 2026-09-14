import Image from 'next/image';
import RatingScore from '@/components/dashboard/rating-score';
import { IconWorld, IconMessageCircle } from '@tabler/icons-react';
import type { RatedAlbum } from '@/features/ratings/queries';

function formatRatedDate(date: Date) {
  const days = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) return 'Rated today';
  if (days === 1) return 'Rated yesterday';
  if (days < 30) return `Rated ${days}d ago`;

  return `Rated ${new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
}

export default function RatingCard({
  album,
  priority = false,
}: {
  album: RatedAlbum;
  priority?: boolean;
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
          src={album.coverImage ?? '/albums.jpg'}
          alt={`${album.title} by ${album.artists[0]?.artist.name}`}
          fill
          className='object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]'
          priority={priority}
        />

        {/* Your score is the hero stat here — large, badged, top corner —
            unlike the catalog card where it's one of two equal-weight
            small stats. This page's whole reason to exist is this number. */}
        <div className='absolute top-2 right-2'>
          <RatingScore
            ratingScore={album.userRating}
            size='lg'
            withBackground
            label='Your rating'
          />
        </div>

        {album.hasReview && (
          <div
            className='absolute bottom-2 left-2 flex items-center justify-center h-6 w-6 rounded-full bg-black/60 text-white'
            title='You left a review'
          >
            <IconMessageCircle size={14} />
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

        <div className='flex flex-row items-center justify-between mt-1'>
          <span className='text-[11px] text-gray-500'>
            {formatRatedDate(album.ratedAt)}
          </span>

          <div className='flex flex-row items-center gap-1 text-gray-500'>
            <IconWorld size={13} />
            <RatingScore
              ratingScore={!album.openForRatings ? album.averageRating : null}
              size='sm'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
