import AlbumsClient from './albums-client';
import { getAlbumsPage } from '@/data/albums';

export default async function Page() {
  const MAX_ALBUMS = 6;

  const albums = await getAlbumsPage(1, 30);

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-2xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-4'>
        Albums
      </h1>

      <AlbumsClient albums={albums.albums} maxAlbums={MAX_ALBUMS} />
    </main>
  );
}
