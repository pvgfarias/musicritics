// components/admin/create-artist-dialog.tsx
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
import { createArtist } from '@/features/artists/actions';
import type { CreateArtistInput } from '@/features/artists/schema';
import { useArtistForm } from '@/features/artists/use-artist-form';
import { ArtistFormFields } from '../artist-form-fields';

const DEFAULT_VALUES: CreateArtistInput = {
  name: '',
  slug: '',
  image: null,
  bio: null,
  genre: null,
  debutDate: null,
};

export function CreateArtistDialog() {
  const [open, setOpen] = useState(false);

  const artistForm = useArtistForm(DEFAULT_VALUES);

  const {
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = artistForm.form;

  async function onSubmit(data: CreateArtistInput) {
    const result = await createArtist(data);

    if (result.success) {
      toast.success(`"${data.name}" created`);
      reset();
      setOpen(false);
    } else if (result.field) {
      setError(result.field as keyof CreateArtistInput, {
        message: result.error,
      });
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='rounded-md bg-ember px-4 py-2 text-sm font-medium text-white'>
        New artist
      </DialogTrigger>

      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto p-4'>
        <DialogHeader>
          <DialogTitle>Create Artist</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          <ArtistFormFields {...artistForm} />

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
              Create artist
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
