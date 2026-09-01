// components/admin/delete-artist-dialog.tsx
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
import { deleteArtist } from '@/features/artists/actions';

type DeleteArtistDialogProps = {
  artistId: string;
  artistName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteArtistDialog({
  artistId,
  artistName,
  open,
  onOpenChange,
}: DeleteArtistDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteArtist(artistId);

        if (result.success) {
          toast.success(`"${artistName ?? 'Artist'}" deleted`);
          onOpenChange(false);
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        toast.error(
          `Failed to delete artist. Please try again. Error: ${err}.`
        );
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={'bg-slate-800 dark:text-white'}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete artist?</AlertDialogTitle>
          <AlertDialogDescription>
            {artistName ? (
              <>
                This will permanently delete{' '}
                <strong>&quot;{artistName}&quot;</strong> and remove it from any
                active rotations. This action cannot be undone.
              </>
            ) : (
              <>
                This will permanently delete this artist. This action cannot be
                undone.
              </>
            )}
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
