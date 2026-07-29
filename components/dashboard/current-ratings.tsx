import currentRatings from '@/data/currentRatings';
import CardCarousel from '../ui/card-carousel';
import WeeklyPicksBar from './weekly-picks-bar';

export default function CurrentRatings() {
  const MAX_ALBUMS = 6;

  const ratings = currentRatings.filter(rating => rating.finalized === false);

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row w-full justify-between items-center px-4 md:px-0 pt-4 gap-4'>
        <h2 className='text-2xl font-title font-extrabold text-gray-950 dark:text-white md:text-left text-center pb-6'>
          Weekly Rotation
        </h2>
        <div className='grow border-b border-dashed border-gray-500 mx-2' />
        <div className='flex items-center rounded-xl border border-gray-300 bg-gray-50  dark:border-mist-600  dark:bg-mist-900 px-4 py-1 shadow-sm -mx-1 md:ml-0'>
          <span className='whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-gray-500 dark:text-white'>
            TOTAL: {ratings.length}
          </span>
        </div>
      </div>
      <CardCarousel cardsList={ratings} MAX_CARDS={MAX_ALBUMS} type={'album'} />
    </div>
  );
}
