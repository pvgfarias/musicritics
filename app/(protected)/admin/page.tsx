import { requireDashboardAccess } from '@/lib/auth-helpers';
import { IconCheck, IconPlus } from '@tabler/icons-react';

export default async function Page() {
  const session = await requireDashboardAccess();
  const isAdmin = session?.user.role === 'admin';

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <h1 className='text-3xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-6'>
        Admin Panel
      </h1>
      <button>
        <IconPlus />
        Create Album
      </button>
      <button>
        <IconPlus />
        Create Artist
      </button>
      <button>
        <IconCheck /> Finalize Weekly Rotation
      </button>
    </main>
  );
}
