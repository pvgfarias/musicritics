import type { AlbumSummary } from '@/data/albums';
import CardGrid from '../ui/card-grid';
import WeeklyPicksBar from './weekly-picks-bar';

export default function WeeklyRotation({ albums }: { albums: AlbumSummary[] }) {
  const MAX_ALBUMS = 4;

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-lg font-title font-extrabold text-gray-950 dark:text-white md:text-left text-center'>
          Weekly Rotation
        </h2>
        <WeeklyPicksBar />
      </div>
      <CardGrid cardsList={albums} MAX_CARDS={MAX_ALBUMS} viewMode='grid' />
    </div>
  );
}
