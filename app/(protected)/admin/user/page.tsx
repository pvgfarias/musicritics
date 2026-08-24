import { redirect } from 'next/navigation';
import { requireDashboardAccess } from '@/lib/auth-helpers';

export default async function UserManagementPage() {
  const session = await requireDashboardAccess();
  if (!session) return null;
  if (session.user.role !== 'admin') redirect('/admin');

  return <h1>Manage Users</h1>;
}
