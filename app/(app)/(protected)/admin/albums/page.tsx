import AdminAlbumsView from '@/features/albums/components/admin/admin-albums-view';
import { getAlbumsPage } from '@/features/albums/queries';
import { auth } from '@/features/auth/auth';
import type { SortField, SortDirection } from '@/lib/sort-ratings';
import { defaultDirectionForField } from '@/lib/sort-ratings';
import type { RatedStatus } from '@/features/albums/components/album-rated-filter';
import { headers } from 'next/headers';
import { getTopLevelGenres } from '@/lib/search-genres';
import { AlbumStatus } from '@/features/albums/components/album-status-filter';

const PAGE_SIZE = 15;

type PageProps = {
  searchParams: Promise<{
    page?: string;
    query?: string;
    genre?: string;
    status?: AlbumStatus;
    sort?: string;
    dir?: string;
    rated?: RatedStatus;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const sortField = (params.sort as SortField) ?? 'recent';
  const sortDirection =
    (params.dir as SortDirection) ?? defaultDirectionForField[sortField];

  // Admins are always logged in to reach this page, so `rated` doesn't need
  // the same conditional gating as the public albums page — but the filter
  // still only means anything relative to a specific viewer, so it's the
  // admin's own ratings being filtered on here, not some general concept.
  const ratedFilter = user ? params.rated : undefined;

  const [{ albums, totalPages }, genres] = await Promise.all([
    getAlbumsPage({
      page,
      pageSize: PAGE_SIZE,
      query: params.query,
      genre: params.genre,
      status: params.status,
      sortField,
      sortDirection,
      rated: ratedFilter,
      userId: user?.id,
    }),
    getTopLevelGenres(),
  ]);

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <h1 className='text-3xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-6'>
        Admin Panel: Albums
      </h1>
      <AdminAlbumsView
        albums={albums}
        genres={genres}
        currentPage={page}
        totalPages={totalPages}
      />
    </main>
  );
}
