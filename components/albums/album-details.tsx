import Image from 'next/image';
import { IconDisc } from '@tabler/icons-react';

type AlbumDetailsProps = {
  album: {
    title: string;
    artist: string;
    artistNames?: string[];
    coverImage?: string | null;
    genre?: string | null;
    releaseYear?: number | null;
    finalized?: boolean | null;
  };
};

export default function AlbumDetails({ album }: AlbumDetailsProps) {
  return (
    <div className='flex flex-row gap-4 w-full'>
      <div className='relative'>
        {!album.finalized && (
          <div className='flex flex-row justify-center items-center gap-2 absolute rounded-full border border-gray-300 dark:border-mist-600 bg-gray-50 dark:bg-mist-900 text-dark-blue shadow-sm font-mono z-30 top-2 right-2 px-1.5 py-0.5 text-[10px]'>
            <IconDisc size={14} />
            <h2>In Rotation</h2>
          </div>
        )}
        <Image
          src={album.coverImage ? `/${album.coverImage}` : '/albums.jpg'}
          alt={`${album.title} by ${album.artist}`}
          width={250}
          height={250}
          className='shadow-sm z-10 rounded-md'
          loading='eager'
        />
      </div>
      <div className='flex flex-col gap-4 px-4'>
        <h1 className='text-4xl font-title font-extrabold text-gray-950 dark:text-white md:text-left text-center pb-8 underline underline-offset-16 decoration-dark-blue decoration-4'>
          {album.title}
        </h1>
        <div className='flex flex-row justify-start items-center gap-2'>
          <h2 className='text-lg'>{album.artist}</h2>
        </div>
        <div className='flex flex-row gap-2'>
          {album.genre && (
            <div className='bg-gray-300 rounded-md py-1 px-2 w-fit text-gray-600 font-mono text-xs'>
              {album.genre}
            </div>
          )}
          {album.releaseYear && (
            <div className='bg-gray-300 rounded-md py-1 px-2 w-fit text-gray-600 font-mono text-xs'>
              {album.releaseYear}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
