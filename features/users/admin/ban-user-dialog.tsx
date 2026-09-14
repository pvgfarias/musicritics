'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { IconLoader2 } from '@tabler/icons-react';
import { banUser } from '@/features/users/actions';

type BanUserDialogProps = {
  userId: string;
  username?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DURATION_OPTIONS = [
  { label: '24 hours', days: 1 },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: 'Permanent', days: undefined },
] as const;

export function BanUserDialog({
  userId,
  username,
  open,
  onOpenChange,
}: BanUserDialogProps) {
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  function handleClose(next: boolean) {
    if (!next) {
      setReason('');
      setDuration(undefined);
    }
    onOpenChange(next);
  }

  function handleBan() {
    startTransition(async () => {
      try {
        const result = await banUser(userId, reason, duration);
        if (result.success) {
          toast.success(`@${username ?? 'user'} has been banned`);
          handleClose(false);
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        toast.error(`Failed to ban user. Error: ${err}.`);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='bg-slate-800 dark:text-white max-w-md'>
        <DialogHeader>
          <DialogTitle>Ban {username ? `@${username}` : 'user'}?</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4'>
          <p className='text-sm text-gray-400'>
            This immediately signs them out and blocks sign-in until unbanned.
          </p>

          <label className='flex flex-col gap-1 text-sm'>
            Reason (optional, shown to the user)
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={2}
              className='rounded-md border border-gray-700 bg-transparent p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember'
              placeholder='e.g. Spamming reviews'
            />
          </label>

          <div className='flex flex-col gap-1 text-sm'>
            Duration
            <div className='flex flex-wrap gap-2'>
              {DURATION_OPTIONS.map(opt => (
                <button
                  key={opt.label}
                  type='button'
                  onClick={() => setDuration(opt.days)}
                  className={`rounded-md px-3 py-1 text-xs border ${
                    duration === opt.days
                      ? 'bg-ember border-ember text-white'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            type='button'
            onClick={() => handleClose(false)}
            disabled={isPending}
            className='rounded-md px-4 py-2 text-sm'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleBan}
            disabled={isPending}
            className='flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60'
          >
            {isPending && <IconLoader2 size={14} className='animate-spin' />}
            Ban user
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
