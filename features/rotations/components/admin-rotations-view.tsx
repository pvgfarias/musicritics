'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import type {
  ActiveRotationAdmin,
  RotationSummary,
} from '@/features/rotations/queries';
import {
  ActiveRotationActionsMenu,
  PastRotationActionsMenu,
} from './admin/rotation-actions-menu';
import { AddAlbumsDialog } from './admin/add-albums-dialog';
import { EditRotationDialog } from './admin/edit-rotation-dialog';
import { FinalizeRotationDialog } from './admin/finalize-rotation-dialog';
import { DeleteRotationDialog } from './admin/delete-rotation-dialog';
import {
  sendRotationReminder,
  deleteRotation,
} from '@/features/rotations/actions';
import { CreateRotationDialog } from './admin/create-rotation-dialog';

type Props = {
  activeRotation: ActiveRotationAdmin;
  pastRotations: RotationSummary[];
};

export default function AdminRotationsView({
  activeRotation,
  pastRotations,
}: Props) {
  const [addingAlbumsTo, setAddingAlbumsTo] = useState(false);
  const [editing, setEditing] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [deletingActive, setDeletingActive] = useState(false);
  const [deletingPast, setDeletingPast] = useState<RotationSummary | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  function handleSendReminder() {
    if (!activeRotation) return;
    startTransition(async () => {
      const result = await sendRotationReminder(activeRotation.id);
      if (result.success) {
        toast.success('Reminder sent');
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className='flex flex-col gap-8'>
      <section className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-title text-gray-950 dark:text-white'>
            Current rotation
          </h2>
          {!activeRotation && <CreateRotationDialog />}
        </div>

        {activeRotation ? (
          <div className='rounded-md border border-gray-200 dark:border-slate-800 p-4 flex flex-col gap-4'>
            <div className='flex items-start justify-between'>
              <div>
                <p className='font-medium text-lg'>{activeRotation.name}</p>
                <p className='text-sm text-gray-500 dark:text-gray-400 font-mono'>
                  {new Date(activeRotation.startDate).toLocaleDateString()} –{' '}
                  {new Date(activeRotation.endDate).toLocaleDateString()}
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  {activeRotation.raterCount} / {activeRotation.totalUsers}{' '}
                  users have rated something in this rotation
                </p>
              </div>
              <ActiveRotationActionsMenu
                onAddAlbums={() => setAddingAlbumsTo(true)}
                onEdit={() => setEditing(true)}
                onSendReminder={handleSendReminder}
                onFinalize={() => setFinalizing(true)}
                onDelete={() => setDeletingActive(true)}
              />
            </div>

            <div className='flex flex-row gap-3 flex-wrap'>
              {activeRotation.albums.map(album => (
                <Link key={album.id} href={`/dashboard/albums/${album.slug}`}>
                  <Image
                    src={album.coverImage ?? '/albums.jpg'}
                    alt={album.title}
                    width={72}
                    height={72}
                    className='rounded-md'
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className='text-sm text-gray-500 dark:text-gray-400 py-6'>
            No rotation is currently active.
          </p>
        )}
      </section>

      <div className='h-px bg-gray-300 dark:bg-slate-800 w-full' />

      <section className='flex flex-col gap-3'>
        <h2 className='text-2xl font-title text-gray-950 dark:text-white'>
          Past rotations
        </h2>
        {pastRotations.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {pastRotations.map(rotation => (
              <div
                key={rotation.id}
                className='rounded-md border border-gray-200 dark:border-slate-800 p-3 flex flex-col gap-2'
              >
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='font-medium'>{rotation.name}</p>
                    <p className='text-xs text-gray-500 dark:text-gray-400 font-mono'>
                      {new Date(rotation.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <PastRotationActionsMenu
                    onDelete={() => setDeletingPast(rotation)}
                  />
                </div>
                <div className='flex flex-row gap-2'>
                  {rotation.topAlbums.map(a => (
                    <Image
                      key={a.id}
                      src={a.coverImage ?? '/albums.jpg'}
                      alt={a.title}
                      width={48}
                      height={48}
                      className='rounded-md'
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            No past rotations yet.
          </p>
        )}
      </section>

      <AddAlbumsDialog
        rotationId={activeRotation?.id ?? null}
        existingAlbumIds={activeRotation?.albums.map(a => a.id) ?? []}
        open={addingAlbumsTo}
        onOpenChange={setAddingAlbumsTo}
      />
      <EditRotationDialog
        rotation={activeRotation}
        open={editing}
        onOpenChange={setEditing}
      />
      <FinalizeRotationDialog
        rotationId={activeRotation?.id ?? null}
        rotationName={activeRotation?.name}
        open={finalizing}
        onOpenChange={setFinalizing}
      />
      <DeleteRotationDialog
        rotationId={activeRotation?.id ?? null}
        rotationName={activeRotation?.name}
        open={deletingActive}
        onOpenChange={setDeletingActive}
      />
      <DeleteRotationDialog
        rotationId={deletingPast?.id ?? null}
        rotationName={deletingPast?.name}
        open={!!deletingPast}
        onOpenChange={open => !open && setDeletingPast(null)}
      />
    </div>
  );
}
