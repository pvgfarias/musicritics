import {
  getActiveRotation,
  getRotationsPage,
} from '@/features/rotations/queries';
import { auth } from '@/features/auth/auth';
import { headers } from 'next/headers';
import RotationsClient from '@/features/rotations/components/rotations-client';

const PAST_ROTATIONS_PAGE_SIZE = 6;

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function RotationPage({ searchParams }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const [activeRotation, pastRotations] = await Promise.all([
    getActiveRotation(user?.id),
    getRotationsPage({ page, pageSize: PAST_ROTATIONS_PAGE_SIZE }),
  ]);

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <h1 className='text-3xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-6'>
        Weekly Rotation
      </h1>
      <RotationsClient
        activeRotation={activeRotation}
        isSignedIn={Boolean(user)}
        pastRotations={pastRotations.rotations}
        currentPage={page}
        totalPages={pastRotations.totalPages}
      />
    </main>
  );
}
