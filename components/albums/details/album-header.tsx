import { AlbumFull } from '@/data/albums';
import { IconDisc } from '@tabler/icons-react';
import Image from 'next/image';

export default function AlbumHeader({
  album,
}: {
  album: Exclude<AlbumFull, null>;
}) {
  if (!album) return null;

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex flex-row gap-4 items-center'>
        {album.coverImage ? (
          <Image
            src={album.coverImage ? `/${album.coverImage}` : '/albums.jpg'}
            alt={`${album.title} cover`}
            width={350}
            height={350}
            className='rounded-md'
          />
        ) : (
          <div className='w-37.5 h-37.5 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center'>
            <IconDisc size={48} className='text-gray-400 dark:text-gray-500' />
          </div>
        )}
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-title font-extrabold text-gray-950 dark:text-white'>
            {album.title}
          </h1>
          <h2 className='text-lg font-title font-bold text-gray-700 dark:text-gray-300'>
            {album.artist}
            {album.artistNames && album.artistNames.length > 0 && (
              <span className='text-sm font-normal text-gray-500 dark:text-gray-400'>
                {' '}
                ({album.artistNames.join(', ')})
              </span>
            )}
          </h2>
          {album.genre && (
            <p className='text-md font-text text-gray-600 dark:text-gray-400'>
              Genre: {album.genre}
            </p>
          )}
          {album.releaseYear && (
            <p className='text-md font-text text-gray-600 dark:text-gray-400'>
              Released: {album.releaseYear}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
