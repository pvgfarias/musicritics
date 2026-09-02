// components/admin/artist/dialog/edit-artist-dialog.tsx
'use client';

import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { IconLoader2 } from '@tabler/icons-react';
import { toast } from 'sonner';

import { updateArtist, getArtistForEdit } from '@/features/artists/actions';
import { useArtistForm } from '@/features/artists/use-artist-form';
import { ArtistFormFields } from '../artist-form-fields';

import type { CreateArtistInput } from '@/features/artists/schema';
import type { ArtistSummary } from '@/features/artists/queries';

type GenreOption = {
  id: string;
  name: string;
  slug: string;
};

type EditArtistDialogProps = {
  artist: ArtistSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type EditArtistState =
  | { status: 'loading' }
  | { status: 'error' }
  | {
      status: 'ready';
      initialValues: CreateArtistInput;
      initialGenres: GenreOption[];
    };

export function EditArtistDialog({
  artist,
  open,
  onOpenChange,
}: EditArtistDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto p-4'>
        <DialogHeader>
          <DialogTitle>Edit Artist</DialogTitle>
        </DialogHeader>

        {open && artist && (
          <EditArtistLoader
            key={artist.id}
            artistId={artist.id}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditArtistLoader({
  artistId,
  onDone,
}: {
  artistId: string;
  onDone: () => void;
}) {
  const [state, setState] = useState<EditArtistState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    getArtistForEdit(artistId)
      .then(full => {
        if (cancelled) return;

        setState({
          status: 'ready',
          initialValues: {
            name: full.name,
            slug: full.slug,
            image: full.image,
            bio: full.bio,
            genreIds: full.genres.map(g => g.genre.id),
            debutDate: full.debutDate,
          },
          initialGenres: full.genres.map(g => ({
            id: g.genre.id,
            name: g.genre.name,
            slug: g.genre.slug,
          })),
        });
      })
      .catch(err => {
        if (cancelled) return;
        console.error(err);
        toast.error('Failed to load artist');
        setState({ status: 'error' });
      });

    return () => {
      cancelled = true;
    };
  }, [artistId]);

  if (state.status === 'loading') {
    return (
      <div className='flex items-center justify-center py-12'>
        <IconLoader2 size={20} className='animate-spin text-gray-400' />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <p className='py-8 text-center text-sm text-red-600'>
        Couldn&apos;t load this artist. Try closing and reopening.
      </p>
    );
  }

  return (
    <EditArtistForm
      artistId={artistId}
      initialValues={state.initialValues}
      initialGenres={state.initialGenres}
      onDone={onDone}
    />
  );
}

function EditArtistForm({
  artistId,
  initialValues,
  initialGenres,
  onDone,
}: {
  artistId: string;
  initialValues: CreateArtistInput;
  initialGenres: GenreOption[];
  onDone: () => void;
}) {
  const artistForm = useArtistForm(initialValues, initialGenres);

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = artistForm.form;

  async function onSubmit(data: CreateArtistInput) {
    try {
      const result = await updateArtist(artistId, data);

      if (result.success) {
        toast.success(`"${data.name}" updated`);
        onDone();
      } else if (result.field) {
        setError(result.field as keyof CreateArtistInput, {
          message: result.error,
        });
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong saving the artist');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
      <ArtistFormFields {...artistForm} />

      <DialogFooter>
        <button
          type='button'
          onClick={onDone}
          className='rounded-md px-4 py-2 text-sm'
        >
          Cancel
        </button>

        <button
          type='button'
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className='flex items-center gap-2 rounded-md bg-ember px-4 py-2 text-sm font-medium text-white disabled:opacity-60'
        >
          {isSubmitting && <IconLoader2 size={14} className='animate-spin' />}
          Save changes
        </button>
      </DialogFooter>
    </form>
  );
}
