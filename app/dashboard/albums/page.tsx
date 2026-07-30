import AlbumStatus from '@/components/albums/album-status';
import CardGrid from '@/components/ui/card-grid';
import GenreSelector from '@/components/ui/genre-selector';
import SearchBar from '@/components/ui/search-bar';
import currentRatings from '@/data/currentRatings';
import { Suspense } from 'react';

export default function Page() {
  const MAX_ALBUMS = 6;
  return (
    <main>
      <h1 className='text-4xl font-title font-extrabold text-gray-950 dark:text-white md:text-left text-center pb-8 underline underline-offset-16 decoration-summer-blue decoration-4'>
        Albums
      </h1>

      {/* TOGGLE: CURRENTLY BEING RATED / FINALIZED */}
      {/* SORT BY GRADE */}
      <div className='flex flex-row justify-center items-center gap-4 md:gap-8 mb-4'>
        <SearchBar />
        <GenreSelector />
        <AlbumStatus />
      </div>
      <Suspense>
        <CardGrid cardsList={currentRatings} MAX_CARDS={MAX_ALBUMS} />
      </Suspense>
    </main>
  );
}
