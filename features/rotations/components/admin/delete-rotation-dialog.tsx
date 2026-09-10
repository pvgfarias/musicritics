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
import { deleteRotation } from '@/features/rotations/actions';

export function DeleteRotationDialog({
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

  function handleDelete() {
    if (!rotationId) return;
    startTransition(async () => {
      const result = await deleteRotation(rotationId);
      if (result.success) {
        toast.success(`"${rotationName ?? 'Rotation'}" deleted`);
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
          <AlertDialogTitle>Delete rotation?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{' '}
            {rotationName ? (
              <strong>&quot;{rotationName}&quot;</strong>
            ) : (
              'this rotation'
            )}
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className='bg-red-600 text-white hover:bg-red-700 focus:ring-red-600'
          >
            {isPending ? (
              <>
                <IconLoader2 size={16} className='mr-2 animate-spin' />
                Deleting…
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
