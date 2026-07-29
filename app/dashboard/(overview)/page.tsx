import CurrentRatings from '@/components/dashboard/current-ratings';
import RecentReviews from '@/components/dashboard/recent-reviews';
import WeeklyPicksBar from '@/components/dashboard/weekly-picks-bar';

export default function Page() {
  return (
    <main>
      <div className='flex flex-row justify-between items-center'>
        <h3 className='text-4xl font-title font-extrabold text-gray-950 dark:text-white md:text-left text-center pb-8 underline underline-offset-16 decoration-amber-600 decoration-4'>
          Dashboard
        </h3>
        <WeeklyPicksBar />
      </div>
      <CurrentRatings />
      <RecentReviews />
    </main>
  );
}
