import AlbumsClient from './albums-client';
import { getAlbumsPage } from '@/data/albums';

export default async function Page() {
  const MAX_ALBUMS = 6;

  const albums = await getAlbumsPage(1, 10);

  return (
    <main>
      <h1 className='text-2xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-4'>
        Albums
      </h1>

      <AlbumsClient albums={albums.albums} maxAlbums={MAX_ALBUMS} />
    </main>
  );
}
