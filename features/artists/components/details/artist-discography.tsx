import { AlbumGrid } from '@/features/albums/components/display/album-grid';
import { AlbumSummary } from '@/features/albums/queries';

export function ArtistDiscography({ albums }: { albums: AlbumSummary[] }) {
  return (
    <div>
      <div className='flex flex-row justify-between items-center gap-6'>
        <h2 className='text-2xl font-title text-gray-950 dark:text-white md:text-left text-center grow'>
          Discography
        </h2>
        <p className='font-mono text-xs text-gray-600 dark:text-gray-400'>
          {albums.length} albums
        </p>
      </div>
      <div className='h-px bg-gray-300 dark:bg-slate-800 w-full' />
      <AlbumGrid albumList={albums} />
    </div>
  );
}
