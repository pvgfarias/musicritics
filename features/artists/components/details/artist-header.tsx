import Image from 'next/image';
import { ArtistSummary } from '../../queries';
import RatingGrade from '@/components/dashboard/rating-grade';

export function ArtistHeader({ artist }: { artist: ArtistSummary }) {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex flex-row gap-14 '>
        <div className='relative w-87.5 h-87.5 shrink-0'>
          <Image
            src={artist.image ?? 'artists.jpg'}
            alt={`${artist.name}`}
            fill
            className='rounded-md'
          />
        </div>

        <div className='flex flex-col gap-4 w-full'>
          <span className='font-mono text-xs text-ember tracking-[0.2em] uppercase'>
            ARTIST • {artist.genre}
          </span>
          <h1 className='text-5xl font-title text-gray-950 dark:text-white'>
            {artist.name}
          </h1>
          <h2 className='text-lg  text-gray-800 dark:text-gray-200'>
            Debut: {artist.debutDate?.getFullYear()}
          </h2>
          <p className='text-sm text-gray-800 dark:text-gray-200'>
            {artist.bio}
          </p>
          <div className='h-px bg-gray-300 dark:bg-slate-800 w-full mt-4' />
          <div className='flex flex-row justify-start items-center gap-8'>
            <div className='flex flex-col justify-start h-full'>
              <span className='font-mono text-xs text-gray-600 dark:text-gray-300 uppercase tracking-widest'>
                My Score
              </span>
              {artist.userAverageRating && (
                <div className='relative group inline-block'>
                  <RatingGrade
                    ratingGrade={artist.userAverageRating}
                    size='lg'
                  />
                </div>
              )}
            </div>
            <div className='flex flex-col justify-start h-full'>
              <span className='font-mono text-xs text-gray-600 dark:text-gray-300 uppercase tracking-widest'>
                Public Score
              </span>
              <RatingGrade ratingGrade={artist.averageRating} size='lg' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
