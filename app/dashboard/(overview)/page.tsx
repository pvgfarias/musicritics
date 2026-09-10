import { auth } from '@/features/auth/auth';
import { ActivityFeed } from '@/features/follows/components/activity-feed';
import { headers } from 'next/headers';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  return (
    <main className='bg-background'>
      <div className='flex flex-row justify-between items-center'>
        <div className='flex flex-col gap-2 pb-8'>
          <h1 className='text-2xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8'>
            Dashboard
          </h1>
        </div>
      </div>

      {user && <ActivityFeed userId={user.id} />}
    </main>
  );
}
