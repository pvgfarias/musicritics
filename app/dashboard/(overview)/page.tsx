import RecentReviews from '@/components/dashboard/recent-reviews';
import TopAlbums from '@/components/dashboard/top-albums';
import TopSongs from '@/components/dashboard/top-songs';
import WeeklyRotation from '@/components/dashboard/weekly-rotation';

export default function Page() {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const d = new Date();
  const day = days[d.getDay()].slice(0, 3);
  const month = months[d.getMonth()];

  return (
    <main className='bg-background'>
      <div className='flex flex-row justify-between items-center'>
        <div className='flex flex-col gap-2 pb-8'>
          <h1 className='text-2xl font-title text-gray-900 dark:text-white'>
            Dashboard
          </h1>
          <p className='text-xs font-mono uppercase text-gray-500 dark:text-gray-300 '>
            {day}, {month} {d.getDay()} — WEEKLY ROTATION REFRESHES IN 2 DAYS
          </p>
        </div>
      </div>
      <div className='flex flex-row gap-6 w-full'>
        <div className='flex flex-col w-4/5'>
          <WeeklyRotation />
          <RecentReviews />
        </div>
        <div className='flex flex-col w-1/5 gap-4'>
          <TopAlbums />
          <TopSongs />
        </div>
      </div>
    </main>
  );
}
