import currentRatings from '@/data/currentRatings';
import CardGrid from '../ui/card-grid';

export default function WeeklyRotation() {
  const MAX_ALBUMS = 8;

  const ratings = currentRatings.filter(rating => rating.finalized === false);

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row w-full justify-between items-center px-4 md:px-0 gap-4'>
        <h2 className='text-2xl font-title font-extrabold text-gray-950 dark:text-white md:text-left text-center'>
          Weekly Rotation
        </h2>
        <div className='grow border-b border-dashed border-gray-400' />
        <div className='flex items-center rounded-xl border border-gray-400 dark:border-mist-600 py-1 px-4'>
          <span className='whitespace-nowrap font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-white'>
            TOTAL: {ratings.length}
          </span>
        </div>
      </div>
      <CardGrid cardsList={ratings} MAX_CARDS={MAX_ALBUMS} />
    </div>
  );
}
