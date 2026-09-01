import AdminArtistsView from '@/features/artists/components/admin/admin-artists-view';
import { getArtistsPage } from '@/features/artists/queries';
import { auth } from '@/features/auth/auth';
import type { SortKey } from '@/lib/sort-ratings';
import { headers } from 'next/headers';

const PAGE_SIZE = 15;

type PageProps = {
  searchParams: Promise<{
    page?: string;
    query?: string;
    sort?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const { artists, totalPages } = await getArtistsPage({
    page,
    pageSize: PAGE_SIZE,
    query: params.query,
    sort: (params.sort as SortKey) ?? 'recent',
    userId: user?.id,
  });

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <h1 className='text-3xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-6'>
        Admin Panel: Artists
      </h1>
      <AdminArtistsView
        artists={artists}
        currentPage={page}
        totalPages={totalPages}
      />
    </main>
  );
}
