'use client';

import { IconPlus, IconTrash } from '@tabler/icons-react';
import { AlbumCoverUploadField } from './album-cover-upload-field';
import { ArtistPickerField } from './artist-picker-field';
import { GenrePickerField } from '@/components/ui/genre-picker-field';
import type { AlbumFormState } from '@/features/albums/use-album-form';

const STREAMING_PLATFORMS = [
  { value: 'SPOTIFY', label: 'Spotify' },
  { value: 'APPLE_MUSIC', label: 'Apple Music' },
  { value: 'DEEZER', label: 'Deezer' },
  { value: 'TIDAL', label: 'Tidal' },
  { value: 'YOUTUBE_MUSIC', label: 'YouTube Music' },
  { value: 'SOUNDCLOUD', label: 'SoundCloud' },
  { value: 'BANDCAMP', label: 'Bandcamp' },
  { value: 'AMAZON_MUSIC', label: 'Amazon Music' },
  { value: 'OTHER', label: 'Other' },
] as const;

const RELEASE_TYPES = [
  { value: 'LP', label: 'LP' },
  { value: 'EP', label: 'EP' },
  { value: 'SINGLE', label: 'Single' },
  { value: 'COMPILATION', label: 'Compilation' },
  { value: 'LIVE', label: 'Live' },
  { value: 'MIXTAPE', label: 'Mixtape' },
  { value: 'SOUNDTRACK', label: 'Soundtrack' },
] as const;

export function AlbumFormFields({
  form,
  tracks,
  streamingLinks,
  artists,
  genres,
  handleTitleChange,
  handleArtistsChange,
  handleGenresChange,
  setSlugTouched,
}: AlbumFormState) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const title = watch('title');

  return (
    <>
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
          <label className='text-sm font-medium'>Release Date</label>
          <input
            type='date'
            defaultValue={
              watch('releaseDate')
                ? new Date(watch('releaseDate') as Date)
                    .toISOString()
                    .slice(0, 10)
                : ''
            }
            onChange={e =>
              setValue(
                'releaseDate',
                e.target.value ? new Date(e.target.value) : null
              )
            }
            className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Release Type</label>
          <select
            {...register('releaseType')}
            className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
          >
            {RELEASE_TYPES.map(rt => (
              <option key={rt.value} value={rt.value}>
                {rt.label}
              </option>
            ))}
          </select>
          {errors.releaseType && (
            <p className='text-xs text-red-600'>{errors.releaseType.message}</p>
          )}
        </div>

        {/*
          Plain text input as a placeholder for labelId — there's no
          LabelPickerField yet (parallel to ArtistPickerField/
          GenrePickerField). Swap this for a real picker once one exists;
          for now it expects a raw Label id typed/pasted in directly.
        */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Label ID (optional)</label>
          <input
            {...register('labelId')}
            placeholder='cku1a2b3c...'
            className='rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
          />
          {errors.labelId && (
            <p className='text-xs text-red-600'>{errors.labelId.message}</p>
          )}
        </div>
      </div>

      {/*
        ArtistPickerField's onChange still needs to supply a `role` per
        artist for this to be fully wired — see the note on ArtistOption in
        use-album-form.ts. Until the picker UI exposes a role control,
        everything submitted here defaults to PRIMARY.
      */}
      <ArtistPickerField value={artists} onChange={handleArtistsChange} />
      {errors.artists && (
        <p className='text-xs text-red-600'>{errors.artists.message}</p>
      )}

      <GenrePickerField value={genres} onChange={handleGenresChange} />
      {errors.genreIds && (
        <p className='text-xs text-red-600'>{errors.genreIds.message}</p>
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
          <div key={field._fieldKey} className='flex items-center gap-2'>
            <input
              type='number'
              {...register(`tracks.${index}.number`, { valueAsNumber: true })}
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
            {/*
              Was a free-text input — platform is now a constrained enum
              (StreamingPlatform), so a select keeps submitted values valid
              and matches the picklist your zod schema enforces.
            */}
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
