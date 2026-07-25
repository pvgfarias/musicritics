import currentRatings from '@/data/currentRatings';
import CardCarousel from '../ui/card-carousel';

export default function RecentRatings() {
  const MAX_ALBUMS = 7;

  const recentReviews = currentRatings.filter(
    rating => rating.finalized === true
  );

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row w-full justify-between items-center px-4 md:px-0 pt-4 gap-4'>
        <h1 className='text-xl font-title tracking-wide text-gray-950 whitespace-nowrap'>
          Recent Reviews
        </h1>
        <div className='grow border-b border-dashed border-gray-500 mx-2' />
        <div className='flex items-center rounded-xl border border-gray-300 bg-gray-50 px-4 py-1 shadow-sm'>
          <span className='whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-gray-500'>
            2 last week
          </span>
        </div>
      </div>

      <CardCarousel cardsList={recentReviews} MAX_CARDS={MAX_ALBUMS} />
    </div>
  );
}
