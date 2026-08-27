// components/admin/delete-album-dialog.tsx
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
import { deleteAlbum } from '@/app/actions/album';

type DeleteAlbumDialogProps = {
  albumId: string;
  albumTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteAlbumDialog({
  albumId,
  albumTitle,
  open,
  onOpenChange,
}: DeleteAlbumDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteAlbum(albumId);

        if (result.success) {
          toast.success(`"${albumTitle ?? 'Album'}" deleted`);
          onOpenChange(false);
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        toast.error(`Failed to delete album. Please try again. Error: ${err}.`);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={'bg-slate-800 dark:text-white'}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete album?</AlertDialogTitle>
          <AlertDialogDescription>
            {albumTitle ? (
              <>
                This will permanently delete{' '}
                <strong>&quot;{albumTitle}&quot;</strong> and remove it from any
                active rotations. This action cannot be undone.
              </>
            ) : (
              <>
                This will permanently delete this album. This action cannot be
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
