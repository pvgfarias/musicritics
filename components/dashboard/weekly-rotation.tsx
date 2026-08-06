import currentRatings from '@/data/currentRatings';
import CardGrid from '../ui/card-grid';
import WeeklyPicksBar from './weekly-picks-bar';

export default function WeeklyRotation() {
  const MAX_ALBUMS = 4;

  const ratings = currentRatings.filter(rating => rating.finalized === false);

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-lg font-title font-extrabold text-gray-950 dark:text-white md:text-left text-center'>
          Weekly Rotation
        </h2>
        <WeeklyPicksBar />
      </div>
      <CardGrid cardsList={ratings} MAX_CARDS={MAX_ALBUMS} />
    </div>
  );
}
