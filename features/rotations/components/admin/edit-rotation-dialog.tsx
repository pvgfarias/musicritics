'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { IconLoader2 } from '@tabler/icons-react';
import { toast } from 'sonner';
import { editRotation } from '@/features/rotations/actions';

type RotationLike = {
  id: string;
  name: string;
  slug: string | null;
  startDate: Date;
  endDate: Date;
};

function toDateInputValue(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export function EditRotationDialog({
  rotation,
  open,
  onOpenChange,
}: {
  rotation: RotationLike | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md p-4'>
        <DialogHeader>
          <DialogTitle>Edit rotation</DialogTitle>
        </DialogHeader>

        {/* key={rotation.id} forces a fresh mount (and fresh useState
            initializers) whenever a different rotation is opened, instead
            of an effect reaching back to sync state from a changed prop. */}
        {open && rotation && (
          <EditRotationForm
            key={rotation.id}
            rotation={rotation}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditRotationForm({
  rotation,
  onDone,
}: {
  rotation: RotationLike;
  onDone: () => void;
}) {
  const [name, setName] = useState(rotation.name);
  const [slug, setSlug] = useState(rotation.slug ?? '');
  const [startDate, setStartDate] = useState(
    toDateInputValue(rotation.startDate)
  );
  const [endDate, setEndDate] = useState(toDateInputValue(rotation.endDate));
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    startTransition(async () => {
      const result = await editRotation({
        rotationId: rotation.id,
        name,
        slug: slug || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
      if (result.success) {
        toast.success('Rotation updated');
        onDone();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Slug (optional)</label>
          <input
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium'>Start date</label>
            <input
              type='date'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium'>End date</label>
            <input
              type='date'
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <button
          type='button'
          onClick={onDone}
          className='rounded-md px-4 py-2 text-sm'
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className='flex items-center gap-2 rounded-md bg-ember px-4 py-2 text-sm font-medium text-white disabled:opacity-60'
        >
          {isPending && <IconLoader2 size={14} className='animate-spin' />}
          Save changes
        </button>
      </DialogFooter>
    </>
  );
}
