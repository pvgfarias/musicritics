import RecentReviews from '@/components/dashboard/recent-reviews';
import TopAlbums from '@/components/dashboard/top-albums';
import TopSongs from '@/components/dashboard/top-songs';
import WeeklyRotation from '@/components/dashboard/weekly-rotation';
import { getAlbumsPage } from '@/features/albums/queries';
import { SortKey } from '@/lib/sort-ratings';

const PAGE_SIZE = 5;

type PageProps = {
  searchParams: Promise<{
    page?: string;
    query?: string;
    genre?: string;
    status?: string;
    sort?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
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
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const { albums, totalPages } = await getAlbumsPage({
    page,
    pageSize: PAGE_SIZE,
    query: params.query,
    genre: params.genre,
    status: params.status,
    sort: (params.sort as SortKey) ?? 'recent',
  });

  return (
    <main className='bg-background'>
      <div className='flex flex-row justify-between items-center'>
        <div className='flex flex-col gap-2 pb-8'>
          <h1 className='text-2xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8'>
            Dashboard
          </h1>
          <p className='text-xs font-mono uppercase text-gray-500 dark:text-gray-300 '>
            {day}, {month} {d.getDay()} — WEEKLY ROTATION REFRESHES IN 2 DAYS
          </p>
        </div>
      </div>
      {/* <div className='flex flex-row gap-6 w-full'>
        <div className='flex flex-col w-4/5'>
          <WeeklyRotation albums={albums} />
          <RecentReviews />
        </div>
        <div className='flex flex-col w-1/5 gap-4'>
          <TopAlbums />
          <TopSongs />
        </div>
      </div> */}
    </main>
  );
}
