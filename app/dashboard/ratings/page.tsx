import { redirect } from 'next/navigation';
import { auth } from '@/features/auth/auth';
import { headers } from 'next/headers';
import { getAlbumsPage } from '@/features/albums/queries';
import { attachRatingMeta } from '@/features/ratings/queries';
import { getTopLevelGenres } from '@/lib/search-genres';
import RatingsView from '@/features/ratings/components/ratings-view';
import type { SortField, SortDirection } from '@/lib/sort-ratings';
import { defaultDirectionForField } from '@/lib/sort-ratings';

const PAGE_SIZE = 15;

type PageProps = {
  searchParams: Promise<{
    page?: string;
    query?: string;
    genre?: string;
    sort?: string;
    dir?: string;
  }>;
};

export default async function RatingsPage({ searchParams }: PageProps) {
  // This page is inherently personal (it's always scoped to the viewer's
  // own ratings), so unlike /dashboard it needs its own auth check rather
  // than relying on proxy.ts.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  // Defaults to showing your highest-rated albums first, rather than
  // 'recent', since that's the more useful default on a page whose whole
  // point is "what have I rated".
  const sortField = (params.sort as SortField) ?? 'user-score';
  const sortDirection =
    (params.dir as SortDirection) ?? defaultDirectionForField[sortField];

  const [{ albums: rawAlbums, totalPages, total }, genres] = await Promise.all([
    getAlbumsPage({
      page,
      pageSize: PAGE_SIZE,
      query: params.query,
      genre: params.genre,
      sortField,
      sortDirection,
      // Forced, not read from searchParams — this page only ever shows
      // albums the viewer has rated, unlike /dashboard/albums where
      // 'rated' is one filter among several.
      rated: 'Rated',
      userId: session.user.id,
    }),
    getTopLevelGenres(),
  ]);

  const albums = await attachRatingMeta(rawAlbums, session.user.id);

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <h1 className='text-3xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-6'>
        Your Ratings
      </h1>

      <RatingsView
        albums={albums}
        genres={genres}
        currentPage={page}
        totalPages={totalPages}
        total={total}
      />
    </main>
  );
}
