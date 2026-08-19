'use client';

import { AlbumFull } from '@/data/albums';
import { IconDisc, IconRefresh } from '@tabler/icons-react';
import Image from 'next/image';
import AlbumRatingDialog from './rating/album-rating-dialog';
import { AlbumTrackForRating } from '@/data/tracks';
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
              src={album.coverImage ? `/${album.coverImage}` : '/albums.jpg'}
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
            <div className='absolute flex justify-center items-center gap-2 bg-ember font-mono text-gray-200 px-2 py-1 text-xs rounded-full bottom-2 right-2'>
              <IconRefresh size={12} /> Weekly Rotation &rarr;
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
              <p className='font-mono text-gray-600 dark:text-gray-500'>
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

          <div className='h-px bg-gray-300 dark:bg-slate-800 w-full mt-4' />
          <div className='flex flex-row justify-start items-center gap-8'>
            <div className='flex flex-col justify-start h-full'>
              <span className='font-mono text-xs text-gray-600 dark:text-gray-500 uppercase tracking-widest'>
                Public Score
              </span>
              {album.finalized ? (
                <p className='font-title text-gray-600 dark:text-gray-500'>
                  <span className='text-5xl text-dark-blue dark:text-white'>
                    {album.albumAverageRating}
                  </span>
                  <sup className='text-lg text-gray-400 dark:text-gray-500 ml-0.5'>
                    /100
                  </sup>
                </p>
              ) : (
                <p className='font-mono text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-2'>
                  Coming soon...
                </p>
              )}
            </div>
            <div className='flex flex-col justify-start h-full'>
              <span className='font-mono text-xs text-gray-600 dark:text-gray-500 uppercase tracking-widest'>
                My Score
              </span>
              {userRating ? (
                <p className='font-title text-gray-600 dark:text-gray-500'>
                  <span className='text-5xl text-ember'>
                    {userRating.score}
                  </span>
                  <sup className='text-lg text-gray-400 dark:text-gray-500 ml-0.5'>
                    /100
                  </sup>
                </p>
              ) : (
                <p className='font-mono text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-2'>
                  No rating yet...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
