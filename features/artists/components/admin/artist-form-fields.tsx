// components/admin/artist-form-fields.tsx
'use client';

import { ArtistImageUploadField } from './artist-image-upload-field';
import { GenrePickerField } from '@/components/ui/genre-picker-field';
import type { ArtistFormState } from '@/features/artists/use-artist-form';

export function ArtistFormFields({
  form,
  genres,
  handleNameChange,
  handleBioChange,
  handleGenresChange,
  handleDebutDateChange,
  setSlugTouched,
}: ArtistFormState) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const name = watch('name');
  const bio = watch('bio');
  const debutDate = watch('debutDate');

  return (
    <>
      <ArtistImageUploadField
        value={watch('image')}
        onChange={url => setValue('image', url)}
      />

      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Name</label>
          <input
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
          />
          {errors.name && (
            <p className='text-xs text-red-600'>{errors.name.message}</p>
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
      </div>

      <GenrePickerField value={genres} onChange={handleGenresChange} />
      {errors.genreIds && (
        <p className='text-xs text-red-600'>{errors.genreIds.message}</p>
      )}

      <div className='flex flex-col gap-1'>
        <label className='text-sm font-medium'>Debut date</label>
        <input
          type='date'
          value={debutDate ? debutDate.toISOString().slice(0, 10) : ''}
          onChange={e =>
            handleDebutDateChange(
              e.target.value ? new Date(e.target.value) : null
            )
          }
          className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
        />
        {errors.debutDate && (
          <p className='text-xs text-red-600'>{errors.debutDate.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-1'>
        <label className='text-sm font-medium'>Bio</label>
        <textarea
          value={bio ?? ''}
          onChange={e => handleBioChange(e.target.value)}
          rows={4}
          className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
        />
        {errors.bio && (
          <p className='text-xs text-red-600'>{errors.bio.message}</p>
        )}
      </div>
    </>
  );
}
