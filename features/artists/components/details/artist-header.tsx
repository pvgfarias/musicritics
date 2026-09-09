import Image from 'next/image';
import { ArtistDetail } from '../../queries';
import RatingScore from '@/components/dashboard/rating-score';
// Adjust this path if AlbumPlatformLink lives elsewhere relative to this
// file — it's the same component AlbumHeader uses, reused as-is since it
// only cares about {platform, url}, nothing album-specific.
import { AlbumPlatformLink } from '@/features/albums/components/details/album-platform-link';

function formatActiveYears(debutDate: Date | null, disbandedDate: Date | null) {
  if (!debutDate) return null;
  const start = debutDate.getFullYear();
  if (!disbandedDate) return `${start}–present`;
  return `${start}–${disbandedDate.getFullYear()}`;
}

export function ArtistHeader({ artist }: { artist: ArtistDetail }) {
  const primaryGenre = artist.genreNames[0];
  const activeYears = formatActiveYears(artist.debutDate, artist.disbandedDate);

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex flex-row gap-14 '>
        <div className='relative w-87.5 h-87.5 shrink-0'>
          <Image
            src={artist.image ?? '/user.png'}
            alt={`${artist.name}`}
            fill
            className='rounded-md'
          />
        </div>

        <div className='flex flex-col gap-4 w-full'>
          <span className='font-mono text-xs text-ember tracking-[0.2em] uppercase'>
            ARTIST{primaryGenre ? ` • ${primaryGenre}` : ''}
            {artist.country ? ` • ${artist.country}` : ''}
          </span>
          <h1 className='text-5xl font-title text-gray-950 dark:text-white'>
            {artist.name}
          </h1>
          {activeYears && (
            <h2 className='text-lg  text-gray-800 dark:text-gray-200'>
              {activeYears}
            </h2>
          )}
          <p className='text-sm text-gray-800 dark:text-gray-200'>
            {artist.bio}
          </p>

          <div className='flex flex-row gap-3'>
            {artist.streamingLinks.map(link => (
              <AlbumPlatformLink
                key={link.platform}
                platform={link.platform}
                url={link.url}
              />
            ))}
          </div>

          <div className='h-px bg-gray-300 dark:bg-slate-800 w-full mt-4' />
          <div className='flex flex-row justify-start items-center gap-8'>
            <div className='flex flex-col justify-start h-full'>
              <span className='font-mono text-xs text-gray-600 dark:text-gray-300 uppercase tracking-widest'>
                My Score
              </span>
              {artist.userAverageRating && (
                <div className='relative group inline-block'>
                  <RatingScore
                    ratingScore={artist.userAverageRating}
                    size='lg'
                  />
                </div>
              )}
            </div>
            <div className='flex flex-col justify-start h-full'>
              <span className='font-mono text-xs text-gray-600 dark:text-gray-300 uppercase tracking-widest'>
                Public Score
              </span>
              <RatingScore ratingScore={artist.averageRating} size='lg' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
