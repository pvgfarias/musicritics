'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { IconLoader2 } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createRotation } from '@/features/rotations/actions';

export function CreateRotationDialog() {
  return (
    <Dialog>
      <DialogTrigger className='rounded-md bg-ember px-4 py-2 text-sm font-medium text-white'>
        New rotation
      </DialogTrigger>
      <CreateRotationForm />
    </Dialog>
  );
}

// Split out so remounting on trigger click naturally resets state — the
// Dialog's own open/close handles this since DialogContent unmounts
// children when closed by default in this component set (matching
// CreateAlbumDialog's simpler pattern, since there's no external `open`
// prop here to key off of).
function CreateRotationForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!name || !startDate || !endDate) {
      toast.error('Name, start date, and end date are required.');
      return;
    }
    startTransition(async () => {
      const result = await createRotation({
        name,
        slug: slug || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        albumIds: [],
      });
      if (result.success) {
        toast.success(`"${name}" created`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <DialogContent className='max-w-md p-4'>
      <DialogHeader>
        <DialogTitle>Create rotation</DialogTitle>
      </DialogHeader>

      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='e.g. Week of Sept 15'
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

        <p className='text-xs text-gray-500 dark:text-gray-400'>
          Add albums to it after creating, from the rotation&apos;s menu.
        </p>
      </div>

      <DialogFooter>
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className='flex items-center gap-2 rounded-md bg-ember px-4 py-2 text-sm font-medium text-white disabled:opacity-60'
        >
          {isPending && <IconLoader2 size={14} className='animate-spin' />}
          Create rotation
        </button>
      </DialogFooter>
    </DialogContent>
  );
}
