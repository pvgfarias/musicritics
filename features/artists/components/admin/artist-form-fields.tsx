// components/admin/artist-form-fields.tsx
'use client';

import { IconPlus, IconTrash } from '@tabler/icons-react';
import { ArtistImageUploadField } from './artist-image-upload-field';
import { GenrePickerField } from '@/components/ui/genre-picker-field';
import { STREAMING_PLATFORMS } from '@/lib/streaming-platforms';
import type { ArtistFormState } from '@/features/artists/use-artist-form';

export function ArtistFormFields({
  form,
  genres,
  streamingLinks,
  handleNameChange,
  handleBioChange,
  handleGenresChange,
  handleCountryChange,
  handleDebutDateChange,
  handleDisbandedDateChange,
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
  const country = watch('country');
  const debutDate = watch('debutDate');
  const disbandedDate = watch('disbandedDate');

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

        {/*
          Plain text input, auto-uppercased by handleCountryChange to match
          the schema's 2-letter ISO code regex. If you'd rather have a
          searchable country-name dropdown instead of expecting someone to
          type/remember a code, that's a separate picker component — this
          is the lower-effort version.
        */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Country</label>
          <input
            value={country ?? ''}
            onChange={e => handleCountryChange(e.target.value)}
            placeholder='US'
            maxLength={2}
            className='rounded-md border border-gray-300 px-3 py-1.5 text-sm uppercase dark:border-gray-700 dark:bg-gray-900'
          />
          {errors.country && (
            <p className='text-xs text-red-600'>{errors.country.message}</p>
          )}
        </div>

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
          <label className='text-sm font-medium'>Disbanded date</label>
          <input
            type='date'
            value={
              disbandedDate ? disbandedDate.toISOString().slice(0, 10) : ''
            }
            onChange={e =>
              handleDisbandedDateChange(
                e.target.value ? new Date(e.target.value) : null
              )
            }
            className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
          />
          {errors.disbandedDate && (
            <p className='text-xs text-red-600'>
              {errors.disbandedDate.message}
            </p>
          )}
        </div>
      </div>

      <GenrePickerField value={genres} onChange={handleGenresChange} />
      {errors.genreIds && (
        <p className='text-xs text-red-600'>{errors.genreIds.message}</p>
      )}

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

      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <label className='text-sm font-medium'>Streaming links</label>
          <button
            type='button'
            onClick={() =>
              streamingLinks.append({ platform: 'SPOTIFY', url: '' })
            }
            className='flex items-center gap-1 text-xs text-ember'
          >
            <IconPlus size={14} /> Add link
          </button>
        </div>

        {streamingLinks.fields.map((field, index) => (
          <div key={field._fieldKey} className='flex items-center gap-2'>
            <select
              {...register(`streamingLinks.${index}.platform`)}
              className='w-36 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
            >
              {STREAMING_PLATFORMS.map(p => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <input
              {...register(`streamingLinks.${index}.url`)}
              placeholder='URL'
              className='flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
            />
            <button
              type='button'
              onClick={() => streamingLinks.remove(index)}
              className='text-gray-400 hover:text-red-600'
              aria-label='Remove link'
            >
              <IconTrash size={16} />
            </button>
          </div>
        ))}
        {errors.streamingLinks && (
          <p className='text-xs text-red-600'>
            {errors.streamingLinks.message}
          </p>
        )}
      </div>
    </>
  );
}
