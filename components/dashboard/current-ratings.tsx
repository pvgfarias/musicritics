import currentRatings from '@/data/currentRatings';
import CardCarousel from '../ui/card-carousel';
import WeeklyPicksBar from './weekly-picks-bar';

export default function CurrentRatings() {
  const MAX_ALBUMS = 7;

  const ratings = currentRatings.filter(rating => rating.finalized === false);

  return (
    <div className='flex flex-col'>
      <WeeklyPicksBar />
      <div className='flex flex-row w-full justify-between items-center px-4 md:px-0 pt-4 gap-4'>
        <h1 className='text-xl font-title tracking-wide text-gray-950 whitespace-nowrap'>
          Weekly Rotation
        </h1>
        <div className='grow border-b border-dashed border-gray-500 mx-2' />
        <div className='flex items-center rounded-xl border border-gray-300 bg-gray-50 px-4 py-1 shadow-sm'>
          <span className='whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-gray-500'>
            1 of 2 rated
          </span>
        </div>
      </div>
      <CardCarousel cardsList={ratings} MAX_CARDS={MAX_ALBUMS} />
    </div>
  );
}
