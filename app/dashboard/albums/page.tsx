// page.tsx
import AlbumsClient from './albums-client';
import { getAlbumsPage } from '@/data/albums';

const PAGE_SIZE = 15;

export default async function Page() {
  const { albums } = await getAlbumsPage(1, PAGE_SIZE);

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <h1 className='text-3xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-6'>
        Albums
      </h1>

      <AlbumsClient
        initialAlbums={albums}
        initialHasMore={albums.length === PAGE_SIZE}
        pageSize={PAGE_SIZE}
      />
    </main>
  );
}
