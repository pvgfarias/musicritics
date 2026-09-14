'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import RatingsDisplay from './display/ratings-display';
import SearchBar from '@/components/ui/search-bar';
import SortSelector from '@/components/ui/sort-selector';
import GenreSelector from '@/components/ui/genre-selector';
import ViewMode from '@/components/ui/view-mode';
import Pagination from '@/components/ui/pagination';
import type { RatedAlbum } from '@/features/ratings/queries';

type Genre = { name: string; slug: string };

type RatingsViewProps = {
  albums: RatedAlbum[];
  genres: Genre[];
  currentPage: number;
  totalPages: number;
  total: number;
};

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  if (hasFilters) {
    return (
      <p className='py-16 text-center text-gray-500'>
        No rated albums match your search or filters.
      </p>
    );
  }

  return (
    <div className='flex flex-col items-center gap-2 py-16 text-center'>
      <p className='text-gray-600 dark:text-gray-300'>
        You haven&apos;t rated any albums yet.
      </p>
      <Link
        href='/dashboard/albums'
        className='text-sm font-medium text-ember hover:underline'
      >
        Browse albums to get started
      </Link>
    </div>
  );
}

// Reads the search/genre params to decide which empty-state copy to show.
// Kept behind its own useSearchParams() call, same as SearchBar/SortSelector/
// FiltersPanel elsewhere in the codebase, so it can sit inside the shared
// Suspense boundary below rather than forcing the whole view client-side.
function RatingsResults({
  albums,
  total,
  viewMode,
}: {
  albums: RatedAlbum[];
  total: number;
  viewMode: 'grid' | 'list';
}) {
  const searchParams = useSearchParams();
  const hasFilters = !!(searchParams.get('query') || searchParams.get('genre'));

  if (total === 0) {
    return <EmptyState hasFilters={hasFilters} />;
  }

  return <RatingsDisplay albums={albums} viewMode={viewMode} />;
}

export default function RatingsView({
  albums,
  genres,
  currentPage,
  totalPages,
  total,
}: RatingsViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div>
      <div className='flex flex-row justify-start items-center gap-2 md:gap-4 mb-2'>
        <Suspense>
          <SearchBar placeholder='Search your ratings...' />
          <SortSelector defaultField='user-score' />
          <div className='ml-auto flex flex-row items-center gap-2 md:gap-4'>
            <GenreSelector genres={genres} />
            <ViewMode viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </Suspense>
      </div>

      <Suspense>
        <RatingsResults albums={albums} total={total} viewMode={viewMode} />
      </Suspense>

      <Suspense>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
