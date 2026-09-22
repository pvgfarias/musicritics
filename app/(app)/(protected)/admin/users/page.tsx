import { redirect } from 'next/navigation';
import { requireDashboardAccess } from '@/features/auth/auth-helpers';
import { getUsersPage } from '@/features/users/queries';
import AdminUsersView from '@/features/users/admin/admin-users-view';

const PAGE_SIZE = 15;

type PageProps = {
  searchParams: Promise<{
    page?: string;
    query?: string;
  }>;
};

export default async function UserManagementPage({ searchParams }: PageProps) {
  const session = await requireDashboardAccess();
  if (!session) return null;
  if (session.user.role !== 'admin') redirect('/admin');

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const { users, totalPages, totalUsers } = await getUsersPage({
    page,
    pageSize: PAGE_SIZE,
    query: params.query,
  });

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <h1 className='text-3xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-6'>
        Admin Panel: Manage Users
      </h1>
      <AdminUsersView
        users={users}
        currentPage={page}
        totalPages={totalPages}
        totalUsers={totalUsers}
      />
    </main>
  );
}
