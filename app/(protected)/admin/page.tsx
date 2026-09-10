import { requireDashboardAccess } from '@/features/auth/auth-helpers';
import { IconPlus, IconRotate } from '@tabler/icons-react';
import Link from 'next/link';

export default async function Page() {
  const session = await requireDashboardAccess();
  const isAdmin = session?.user.role === 'admin';

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <h1 className='text-3xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-6'>
        Admin Panel
      </h1>
      <Link href='/admin/albums'>
        <IconPlus />
        Create Album
      </Link>
      <Link href='/admin/artists'>
        <IconPlus />
        Create Artist
      </Link>
      <Link href='/admin/rotations'>
        <IconRotate />
        Manage Rotations
      </Link>
      <div>
        <h3>Recent Reviews</h3>
      </div>
    </main>
  );
}
