import AlbumDetails from '@/components/albums/album-details';
import AlbumStats from '@/components/albums/album-stats';
import { IconBubble, IconPlaylist } from '@tabler/icons-react';
import Image from 'next/image';
import { getAlbumWithAverageRating } from '@/data/albums';
import { notFound } from 'next/navigation';

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) notFound();

  const album = await getAlbumWithAverageRating(slug);
  if (!album) notFound();

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <h1>Get</h1>
      <div className='flex flex-col gap-8'>
        <div className='flex flex-row justify-center items-center '>
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
              <div key={`${track}-${index}`}>
                <div className='flex flex-row justify-between items-center'>
                  <p className='text-gray-700'>{track}</p>
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

          {/* <div className='flex flex-col gap-4 bg-foreground px-8 py-4 h-80 overflow-y-auto'>
            {album.ratings?.length ? (
              album.ratings.map(rating => (
                <div key={rating.id} className='flex flex-col'>
                  <div className='flex flex-row gap-2'>
                    <Image
                      src={
                        rating.user?.image && rating.user.image.startsWith('/')
                          ? rating.user.image
                          : '/jr.jpg'
                      }
                      height={20}
                      width={20}
                      alt={rating.user?.username ?? 'User'}
                      className='rounded-full'
                    />
                    <h3 className='text-gray-700'>
                      {rating.user?.username ?? 'User'}
                    </h3>
                    <p className='font-mono text-red-600'>
                      Grade: {rating.score ?? '—'}
                    </p>
                  </div>
                  <p className='text-gray-700'>No comment yet.</p>
                </div>
              ))
            ) : (
              <p className='text-gray-700'>No ratings yet.</p>
            )}
          </div> */}
        </div>
      </div>
    </main>
  );
}
