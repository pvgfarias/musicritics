'use client';

import type {
  ActiveRotation,
  RotationSummary,
} from '@/features/rotations/queries';
import CurrentRotationSection from './current-rotation-section';
import PastRotationCard from './past-rotation-card';
import PastRotationsPagination from './past-rotation-pagination';

export default function RotationsClient({
  activeRotation,
  isSignedIn,
  pastRotations,
  currentPage,
  totalPages,
}: {
  activeRotation: ActiveRotation;
  isSignedIn: boolean;
  pastRotations: RotationSummary[];
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className='flex flex-col'>
      <CurrentRotationSection
        activeRotation={activeRotation}
        isSignedIn={isSignedIn}
      />

      <div className='h-px bg-gray-300 dark:bg-slate-800 w-full mb-6' />

      <section>
        <h2 className='text-2xl font-title text-gray-950 dark:text-white mb-4'>
          Past Rotations
        </h2>

        {pastRotations.length > 0 ? (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
              {pastRotations.map(rotation => (
                <PastRotationCard key={rotation.id} rotation={rotation} />
              ))}
            </div>
            <PastRotationsPagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        ) : (
          <p className='font-mono text-sm text-gray-500 dark:text-gray-400'>
            No past rotations yet.
          </p>
        )}
      </section>
    </div>
  );
}
