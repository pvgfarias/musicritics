interface PageProps {
  params: Promise<{ id: string }>;
}

import AlbumDetails from '@/components/albums/album-details';
import AlbumStats from '@/components/albums/album-stats';
import StarRating from '@/components/albums/star-rating';
import currentRatings from '@/data/currentRatings';
import { IconBubble, IconPlaylist } from '@tabler/icons-react';
import Image from 'next/image';

export default async function AlbumPage({ params }: PageProps) {
  const { id } = await params;
  const album = currentRatings.find(album => album.id === parseInt(id));

  return (
    <main className='max-w-7xl m-auto'>
      {album && (
        <div className='flex flex-col gap-8'>
          <div className='flex flex-row justify-center items-center bg-surface border border-gray-300 dark:border-slate-800'>
            {/* Album information */}
            <AlbumDetails album={album} />
            <AlbumStats album={album} />
          </div>
          <div className='flex flex-col justify-start gap-4'>
            <div className='flex flex-row gap-2 justify-start items-center text-gray-950 dark:text-white md:text-left text-center'>
              <IconPlaylist size={20} />
              <h2 className='text-2xl font-title font-extrabold'>Tracklist</h2>
            </div>

            <div className='flex flex-col gap-4 bg-foreground px-8 py-4 h-80 overflow-y-auto'>
              {album.tracklist.map((track, index) => (
                <div key={index}>
                  <div className='flex flex-row justify-between items-center'>
                    <p className='text-gray-700'>{track}</p>
                    <StarRating rating={0} size={14} />
                  </div>
                  {album.tracklist.length - 1 !== index && (
                    <div className='w-full border border-gray-200 mt-1' />
                  )}
                </div>
              ))}
            </div>
            <div className='flex flex-row gap-2 justify-start items-center text-gray-950 dark:text-white md:text-left text-center'>
              <IconBubble size={20} />
              <h2 className='text-2xl font-title font-extrabold'>Comments</h2>
            </div>

            <div className='flex flex-col gap-4 bg-foreground px-8 py-4 h-80 overflow-y-auto'>
              <div className='flex flex-col'>
                <div className='flex flex-row gap-2'>
                  <Image
                    src='/jr.jpg'
                    height={20}
                    width={20}
                    alt=''
                    className='rounded-full'
                  />
                  <h3 className='text-gray-700'>Jane</h3>
                  <p className='font-mono text-red-600'>Grade: 53</p>
                </div>

                <p className='text-gray-700'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Ratione quod magnam facere nemo dolore veritatis soluta harum
                  non alias? Illo repellat incidunt non rerum officia nulla
                  commodi harum ad quas in eveniet, possimus placeat beatae
                  distinctio culpa molestias corrupti. Eligendi quasi harum
                  omnis quas! Sequi quas dolorem eaque cupiditate libero.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
