import type { AlbumSummary } from '@/data/albums';
import WeeklyPicksBar from './weekly-picks-bar';
import AlbumDisplay from '../albums/display/album-display';

export default function WeeklyRotation({ albums }: { albums: AlbumSummary[] }) {
  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-lg font-title font-extrabold text-gray-950 dark:text-white md:text-left text-center'>
          Weekly Rotation
        </h2>
        <WeeklyPicksBar />
      </div>
      <AlbumDisplay albumList={albums} viewMode='grid' />
    </div>
  );
}
