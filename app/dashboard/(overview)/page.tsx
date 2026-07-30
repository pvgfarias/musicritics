import CurrentRatings from '@/components/dashboard/current-ratings';
import RecentReviews from '@/components/dashboard/recent-reviews';

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
    <main>
      <div className='flex flex-col gap-2 pb-8'>
        <h1 className='text-4xl font-title'>Dashboard</h1>
        <p className='text-xs text-gray-500 font-mono uppercase'>
          {day}, {month} {d.getDay()} — WEEKLY ROTATION REFRESHES IN 2 DAYS
        </p>
      </div>

      <CurrentRatings />
      <RecentReviews />
    </main>
  );
}
