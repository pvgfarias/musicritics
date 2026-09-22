import { requireDashboardAccess } from '@/features/auth/auth-helpers';
import {
  IconDisc,
  IconMicrophone2,
  IconRotate,
  IconStar,
  IconUsers,
} from '@tabler/icons-react';
import Link from 'next/link';

const sections = [
  {
    href: '/admin/albums',
    title: 'Albums',
    description: 'Add, edit, and remove album entries.',
    icon: IconDisc,
    adminOnly: false,
  },
  {
    href: '/admin/artists',
    title: 'Artists',
    description: 'Add, edit, and remove artist profiles.',
    icon: IconMicrophone2,
    adminOnly: false,
  },
  {
    href: '/admin/rotations',
    title: 'Rotations',
    description: 'Manage featured and user rotations.',
    icon: IconRotate,
    adminOnly: false,
  },
  {
    href: '/admin/ratings',
    title: 'Ratings',
    description: 'Review and moderate user ratings.',
    icon: IconStar,
    adminOnly: false,
  },
  {
    href: '/admin/users',
    title: 'Users',
    description: 'Manage user accounts and roles.',
    icon: IconUsers,
    adminOnly: true,
  },
];

export default async function Page() {
  const session = await requireDashboardAccess();
  const isAdmin = session?.user.role === 'admin';

  const visibleSections = sections.filter(s => !s.adminOnly || isAdmin);

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-3xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-8'>
        Admin Panel
      </h1>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {visibleSections.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className='flex items-start gap-4 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-amber-600 dark:hover:border-amber-600 transition-colors'
          >
            <div className='shrink-0 rounded-md bg-amber-600/10 p-2.5 text-amber-600'>
              <Icon size={22} />
            </div>
            <div>
              <h2 className='font-semibold text-gray-900 dark:text-white'>
                {title}
              </h2>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className='mt-10'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
          Recent Reviews
        </h3>
        <div className='rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-sm text-gray-500 dark:text-gray-400'>
          {/* TODO: fetch and list recent reviews here */}
          No recent reviews to show yet.
        </div>
      </div>
    </main>
  );
}
