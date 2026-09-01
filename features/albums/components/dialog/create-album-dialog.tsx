// components/admin/create-album-dialog.tsx
'use client';

import { useState } from 'react';
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
import { createAlbum } from '@/features/albums/actions';
import { useAlbumForm } from '@/features/albums/use-album-form';
import { AlbumFormFields } from '../form/album-form-fields';
import type { CreateAlbumInput } from '@/features/albums/schema';

const DEFAULT_VALUES: CreateAlbumInput = {
  title: '',
  slug: '',
  coverImage: null,
  releaseDate: null,
  genre: '',
  artistIds: [],
  tracks: [{ title: '', number: 1 }],
  socialLinks: [],
};

export function CreateAlbumDialog() {
  const [open, setOpen] = useState(false);

  const albumForm = useAlbumForm(DEFAULT_VALUES);

  const {
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = albumForm.form;

  async function onSubmit(data: CreateAlbumInput) {
    const result = await createAlbum(data);

    if (result.success) {
      toast.success(`"${data.title}" created`);
      reset();
      albumForm.handleArtistsChange([]);
      setOpen(false);
    } else if (result.field) {
      setError(result.field as keyof CreateAlbumInput, {
        message: result.error,
      });
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='rounded-md bg-ember px-4 py-2 text-sm font-medium text-white'>
        New album
      </DialogTrigger>

      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto p-4'>
        <DialogHeader>
          <DialogTitle>Create Album</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          <AlbumFormFields {...albumForm} />

          <DialogFooter>
            <button
              type='button'
              onClick={() => setOpen(false)}
              className='rounded-md px-4 py-2 text-sm'
            >
              Cancel
            </button>

            <button
              type='submit'
              disabled={isSubmitting}
              className='flex items-center gap-2 rounded-md bg-ember px-4 py-2 text-sm font-medium text-white disabled:opacity-60'
            >
              {isSubmitting && (
                <IconLoader2 size={14} className='animate-spin' />
              )}
              Create album
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
