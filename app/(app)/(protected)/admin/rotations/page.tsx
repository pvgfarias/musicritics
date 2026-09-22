import { requireDashboardAccess } from '@/features/auth/auth-helpers';
import {
  getActiveRotationForAdmin,
  getRotationsPage,
} from '@/features/rotations/queries';
import AdminRotationsView from '@/features/rotations/components/admin-rotations-view';

export default async function AdminRotationsPage() {
  await requireDashboardAccess();

  const [activeRotation, { rotations: pastRotations }] = await Promise.all([
    getActiveRotationForAdmin(),
    getRotationsPage({ page: 1, pageSize: 12 }),
  ]);

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <h1 className='text-3xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-6'>
        Manage Rotations
      </h1>
      <AdminRotationsView
        activeRotation={activeRotation}
        pastRotations={pastRotations}
      />
    </main>
  );
}
