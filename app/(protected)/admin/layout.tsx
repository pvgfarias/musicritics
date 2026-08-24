import { redirect } from 'next/navigation';
import { requireDashboardAccess } from '@/lib/auth-helpers';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireDashboardAccess();

  if (!session) redirect('/');

  return <>{children}</>;
}
