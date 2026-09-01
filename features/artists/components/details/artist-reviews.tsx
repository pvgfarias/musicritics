import { AlbumSummary } from '@/features/albums/queries';

export function ArtistReviews() {
  return (
    <div>
      <div className='flex flex-row justify-between items-center gap-6'>
        <h2 className='text-2xl font-title text-gray-950 dark:text-white md:text-left text-center grow'>
          Recent Reviews
        </h2>
      </div>

      {/* Recent Reviews in the format: User Image, User, Album, Grade and comment */}

      <div className='h-px bg-gray-300 dark:bg-slate-800 w-full' />
    </div>
  );
}
