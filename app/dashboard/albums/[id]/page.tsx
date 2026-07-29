interface PageProps {
  params: Promise<{ id: string }>;
}

import AlbumDetails from '@/components/albums/album-details';
import AlbumStats from '@/components/albums/album-stats';
import currentRatings from '@/data/currentRatings';

export default async function AlbumPage({ params }: PageProps) {
  const { id } = await params;
  const album = currentRatings.find(album => album.id === parseInt(id));

  return (
    <main>
      {album && (
        <div className='flex flex-col gap-6'>
          {/* Album information */}
          <AlbumDetails album={album} />
          <AlbumStats album={album} />
          {/* 
            <div className='flex flex-col justify-center items-center gap-4 grow'>
              <h2 className='text-3xl font-title font-bold text-gray-900 dark:text-gray-200 md:text-left text-center pb-4'>
                TRACKLIST
              </h2>
              {album.tracklist.map((track, index) => (
                <div key={index}>
                  <div className='flex flex-row'>{track}</div>

                  {album.tracklist.length - 1 !== index && (
                    <hr className='my-2' />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col justify-center items-center gap-4 grow'>
            <h2 className='text-3xl font-title font-bold text-gray-900 dark:text-gray-200 md:text-left text-center pb-4'>
              COMMENTS
            </h2>
          </div> */}
        </div>
      )}
    </main>
  );
}
