import AlbumsClient from '@/features/albums/components/albums-client';
import { getAlbumsPage } from '@/features/albums/queries';
import type { SortKey } from '@/lib/sort-ratings';
import { auth } from '@/features/auth/auth';
import { headers } from 'next/headers';

const PAGE_SIZE = 15;

type PageProps = {
  searchParams: Promise<{
    page?: string;
    query?: string;
    genre?: string;
    status?: string;
    sort?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const { albums, totalPages } = await getAlbumsPage({
    page,
    pageSize: PAGE_SIZE,
    query: params.query,
    genre: params.genre,
    status: params.status,
    sort: (params.sort as SortKey) ?? 'recent',
    userId: user?.id,
  });

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <h1 className='text-3xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-6'>
        Albums
      </h1>

      <AlbumsClient
        albums={albums}
        currentPage={page}
        totalPages={totalPages}
      />
    </main>
  );
}
