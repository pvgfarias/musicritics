'use client';

import { useTransition } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { IconLoader2 } from '@tabler/icons-react';
import { closeRotation } from '@/features/rotations/actions';

export function FinalizeRotationDialog({
  rotationId,
  rotationName,
  open,
  onOpenChange,
}: {
  rotationId: string | null;
  rotationName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleFinalize() {
    if (!rotationId) return;
    startTransition(async () => {
      const result = await closeRotation(rotationId);
      if (result.success) {
        toast.success(
          `"${rotationName ?? 'Rotation'}" finalized — scores are now public`
        );
        onOpenChange(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='bg-slate-800 dark:text-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>Finalize rotation?</AlertDialogTitle>
          <AlertDialogDescription>
            This closes{' '}
            {rotationName ? (
              <strong>&quot;{rotationName}&quot;</strong>
            ) : (
              'this rotation'
            )}{' '}
            and makes every album&apos;s score public. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleFinalize}
            disabled={isPending}
            className='bg-ember text-white hover:opacity-90'
          >
            {isPending ? (
              <>
                <IconLoader2 size={16} className='mr-2 animate-spin' />
                Finalizing…
              </>
            ) : (
              'Finalize'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
