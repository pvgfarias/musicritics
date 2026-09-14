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
import { deleteUser } from '@/features/users/actions';

type DeleteUserDialogProps = {
  userId: string;
  username?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteUserDialog({
  userId,
  username,
  open,
  onOpenChange,
}: DeleteUserDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteUser(userId);
        if (result.success) {
          toast.success(`@${username ?? 'user'} deleted`);
          onOpenChange(false);
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        toast.error(`Failed to delete user. Error: ${err}.`);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='bg-slate-800 dark:text-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{' '}
            <strong>@{username ?? 'this user'}</strong>&apos;s account,
            sessions, and ratings. Their comments stay published but are
            anonymized (author removed). This action cannot be undone.
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
