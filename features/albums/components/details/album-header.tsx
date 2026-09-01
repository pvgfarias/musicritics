'use client';

import { AlbumFull } from '@/features/albums/queries';
import { IconDisc, IconRefresh } from '@tabler/icons-react';
import Image from 'next/image';
import AlbumRatingDialog from './rating/album-rating-dialog';
import { AlbumTrackForRating } from '@/features/ratings/queries';
import RatingGrade from '@/components/dashboard/rating-grade';
import { AlbumPlatformLink } from './album-platform-link';
type AlbumUserRating = Exclude<AlbumFull, null>['ratings'][number];

export default function AlbumHeader({
  album,
  tracks,
  userRating,
}: {
  album: Exclude<AlbumFull, null>;
  tracks: AlbumTrackForRating[];
  userRating: AlbumUserRating | undefined;
}) {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex flex-row gap-14 '>
        <div className='relative w-87.5 h-87.5 shrink-0'>
          {album.coverImage ? (
            <Image
              src={
                album.coverImage?.includes('http')
                  ? `${album.coverImage}`
                  : `/${album.coverImage}`
              }
              alt={`${album.title} cover`}
              fill
              className='rounded-md'
            />
          ) : (
            <div className='w-37.5 h-37.5 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center'>
              <IconDisc
                size={48}
                className='text-gray-400 dark:text-gray-500'
              />
            </div>
          )}
          {!album.finalized && (
            <div className='absolute flex justify-center items-center gap-2 bg-ember font-mono text-gray-200 px-2.5 py-1 text-xs rounded-full bottom-2 right-2 uppercase'>
              <IconRefresh size={12} /> Weekly Rotation
            </div>
          )}
        </div>

        <div className='flex flex-col gap-4 w-full'>
          <span className='font-mono text-xs text-ember tracking-[0.2em] uppercase'>
            ALBUM • {album.genre}
          </span>
          <h1 className='text-5xl font-title text-gray-950 dark:text-white'>
            {album.title}
          </h1>
          <h2 className='text-lg  text-gray-800 dark:text-gray-200'>
            {album.artist}
          </h2>
          <div className='flex flex-row gap-2 justify-start items-center text-xs '>
            {album.releaseDate && (
              <p className='font-mono text-gray-600 dark:text-gray-400'>
                {`Released: ${album.releaseDate.toLocaleString('default', { month: 'long' })} ${album.releaseDate.getDate()}, ${album.releaseDate.getFullYear()}`}
              </p>
            )}
          </div>
          {!album.finalized && (
            <AlbumRatingDialog
              album={album}
              userRating={userRating}
              tracks={tracks}
            />
          )}

          <div className='flex flex-row gap-3'>
            {album?.socialLinks.map(link => (
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
              {userRating ? (
                <div className='relative group inline-block'>
                  <RatingGrade ratingGrade={userRating.score} size='lg' />

                  {album.finalized && (
                    <div
                      className='pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 
                   w-56 rounded-md bg-gray-900 dark:bg-gray-800 px-3 py-2 
                   text-xs text-gray-200 font-mono text-center
                   opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10'
                    >
                      Your rating for this album is finalized.
                    </div>
                  )}
                </div>
              ) : (
                <p className='font-mono text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-2'>
                  No rating...
                </p>
              )}
            </div>
            <div className='flex flex-col justify-start h-full'>
              <span className='font-mono text-xs text-gray-600 dark:text-gray-300 uppercase tracking-widest'>
                Public Score
              </span>
              {album.finalized ? (
                <RatingGrade ratingGrade={album.albumAverageRating} size='lg' />
              ) : (
                <p className='font-mono text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-2'>
                  IN 3 DAYS...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
