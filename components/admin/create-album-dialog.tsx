// components/admin/create-album-dialog.tsx
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { IconPlus, IconTrash, IconLoader2 } from '@tabler/icons-react';
import { toast } from 'sonner';
import {
  createAlbumSchema,
  type CreateAlbumInput,
} from '@/lib/album-form-schema';
import { createAlbum } from '@/app/actions/album';
import { AlbumCoverUploadField } from './album-cover-upload-field';
import { ArtistPickerField } from './artist-picker-field';

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function CreateAlbumDialog() {
  const [open, setOpen] = useState(false);
  const [artists, setArtists] = useState<
    { id: string; name: string; image: string | null }[]
  >([]);
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAlbumInput>({
    resolver: zodResolver(createAlbumSchema),
    defaultValues: {
      title: '',
      slug: '',
      coverImage: null,
      releaseDate: null,
      genre: '',
      artistIds: [],
      tracks: [{ title: '', number: 1 }],
      socialLinks: [],
    },
  });

  const tracks = useFieldArray({ control, name: 'tracks' });
  const socialLinks = useFieldArray({ control, name: 'socialLinks' });

  const title = watch('title');

  function handleTitleChange(value: string) {
    setValue('title', value);
    if (!slugTouched) setValue('slug', slugify(value));
  }

  async function onSubmit(data: CreateAlbumInput) {
    const result = await createAlbum(data);
    if (result.success) {
      toast.success(`"${data.title}" created`);
      reset();
      setArtists([]);
      setSlugTouched(false);
      setOpen(false);
    } else {
      if (result.field) {
        setError(result.field as keyof CreateAlbumInput, {
          message: result.error,
        });
      } else {
        toast.error(result.error);
      }
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
          <AlbumCoverUploadField
            value={watch('coverImage')}
            onChange={url => setValue('coverImage', url)}
          />

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium'>Title</label>
              <input
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
              />
              {errors.title && (
                <p className='text-xs text-red-600'>{errors.title.message}</p>
              )}
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium'>Slug</label>
              <input
                {...register('slug')}
                onChange={e => {
                  setSlugTouched(true);
                  setValue('slug', e.target.value);
                }}
                className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
              />
              {errors.slug && (
                <p className='text-xs text-red-600'>{errors.slug.message}</p>
              )}
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium'>Genre</label>
              <input
                {...register('genre')}
                className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium'>Release Date</label>
              <input
                type='date'
                onChange={e =>
                  setValue(
                    'releaseDate',
                    e.target.value ? new Date(e.target.value) : null
                  )
                }
                className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
              />
            </div>
          </div>

          <ArtistPickerField
            value={artists}
            onChange={next => {
              setArtists(next);
              setValue(
                'artistIds',
                next.map(a => a.id)
              );
            }}
          />
          {errors.artistIds && (
            <p className='text-xs text-red-600'>{errors.artistIds.message}</p>
          )}

          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>Tracks</label>
              <button
                type='button'
                onClick={() =>
                  tracks.append({ title: '', number: tracks.fields.length + 1 })
                }
                className='flex items-center gap-1 text-xs text-ember'
              >
                <IconPlus size={14} /> Add track
              </button>
            </div>

            {tracks.fields.map((field, index) => (
              <div key={field.id} className='flex items-center gap-2'>
                <input
                  type='number'
                  {...register(`tracks.${index}.number`, {
                    valueAsNumber: true,
                  })}
                  className='w-14 rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900'
                />
                <input
                  {...register(`tracks.${index}.title`)}
                  placeholder='Track title'
                  className='flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
                />
                <button
                  type='button'
                  onClick={() => tracks.remove(index)}
                  disabled={tracks.fields.length === 1}
                  className='text-gray-400 hover:text-red-600 disabled:opacity-30'
                  aria-label='Remove track'
                >
                  <IconTrash size={16} />
                </button>
              </div>
            ))}
            {errors.tracks && (
              <p className='text-xs text-red-600'>{errors.tracks.message}</p>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>Social links</label>
              <button
                type='button'
                onClick={() => socialLinks.append({ platform: '', url: '' })}
                className='flex items-center gap-1 text-xs text-ember'
              >
                <IconPlus size={14} /> Add link
              </button>
            </div>

            {socialLinks.fields.map((field, index) => (
              <div key={field.id} className='flex items-center gap-2'>
                <input
                  {...register(`socialLinks.${index}.platform`)}
                  placeholder='Platform'
                  className='w-28 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
                />
                <input
                  {...register(`socialLinks.${index}.url`)}
                  placeholder='URL'
                  className='flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
                />
                <button
                  type='button'
                  onClick={() => socialLinks.remove(index)}
                  className='text-gray-400 hover:text-red-600'
                  aria-label='Remove link'
                >
                  <IconTrash size={16} />
                </button>
              </div>
            ))}
          </div>

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
