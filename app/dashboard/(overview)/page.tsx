import CurrentRatings from '@/components/dashboard/current-ratings';
import RecentReviews from '@/components/dashboard/recent-reviews';

export default function Page() {
  return (
    <main>
      <h3 className='text-4xl font-title font-extrabold text-gray-950 md:text-left text-center pb-8 underline underline-offset-16 decoration-amber-600 decoration-4'>
        Dashboard
      </h3>
      <CurrentRatings />
      <RecentReviews />
    </main>
  );
}
