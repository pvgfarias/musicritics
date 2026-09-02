// components/admin/album/dialog/edit-album-dialog.tsx
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

import { updateAlbum, getAlbumForEdit } from '@/features/albums/actions';
import { useAlbumForm } from '@/features/albums/use-album-form';
import { AlbumFormFields } from '../form/album-form-fields';

import type { CreateAlbumInput } from '@/features/albums/schema';
import type { AlbumSummary } from '@/features/albums/queries';

type ArtistOption = {
  id: string;
  name: string;
  image: string | null;
};

type GenreOption = {
  id: string;
  name: string;
  slug: string;
};

type EditAlbumDialogProps = {
  album: AlbumSummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type EditAlbumState =
  | { status: 'loading' }
  | { status: 'error' }
  | {
      status: 'ready';
      initialValues: CreateAlbumInput;
      initialArtists: ArtistOption[];
      initialGenres: GenreOption[];
    };

export function EditAlbumDialog({
  album,
  open,
  onOpenChange,
}: EditAlbumDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto p-4'>
        <DialogHeader>
          <DialogTitle>Edit Album</DialogTitle>
        </DialogHeader>

        {open && (
          <EditAlbumLoader
            key={album.id}
            albumId={album.id}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditAlbumLoader({
  albumId,
  onDone,
}: {
  albumId: string;
  onDone: () => void;
}) {
  const [state, setState] = useState<EditAlbumState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    getAlbumForEdit(albumId)
      .then(full => {
        if (cancelled) return;

        setState({
          status: 'ready',
          initialValues: {
            title: full.title,
            slug: full.slug,
            coverImage: full.coverImage,
            releaseDate: full.releaseDate,
            artistIds: full.artists.map(a => a.artistId),
            genreIds: full.genres.map(g => g.genreId),
            tracks: full.tracks.map((t, index) => ({
              title: t.title,
              number: t.number ?? index + 1,
            })),
            socialLinks: full.socialLinks.map(s => ({
              platform: s.platform,
              url: s.url,
            })),
          },
          initialArtists: full.artists.map(a => ({
            id: a.artist.id,
            name: a.artist.name,
            image: a.artist.image,
          })),
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
        toast.error('Failed to load album');
        setState({ status: 'error' });
      });

    return () => {
      cancelled = true;
    };
  }, [albumId]);

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
        Couldn&apos;t load this album. Try closing and reopening.
      </p>
    );
  }

  return (
    <EditAlbumForm
      albumId={albumId}
      initialValues={state.initialValues}
      initialArtists={state.initialArtists}
      initialGenres={state.initialGenres}
      onDone={onDone}
    />
  );
}

function EditAlbumForm({
  albumId,
  initialValues,
  initialArtists,
  initialGenres,
  onDone,
}: {
  albumId: string;
  initialValues: CreateAlbumInput;
  initialArtists: ArtistOption[];
  initialGenres: GenreOption[];
  onDone: () => void;
}) {
  const albumForm = useAlbumForm(initialValues, initialArtists, initialGenres);

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = albumForm.form;

  async function onSubmit(data: CreateAlbumInput) {
    try {
      const result = await updateAlbum(albumId, data);

      if (result.success) {
        toast.success(`"${data.title}" updated`);
        onDone();
      } else if (result.field) {
        setError(result.field as keyof CreateAlbumInput, {
          message: result.error,
        });
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong saving the album');
    }
  }

  return (
    <form
      onSubmit={e => {
        console.log('raw form submit event fired');
        handleSubmit(onSubmit)(e);
      }}
      className='flex flex-col gap-5'
    >
      <AlbumFormFields {...albumForm} />

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
