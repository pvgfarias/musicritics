// components/admin/artist-picker-field.tsx
'use client';

import { useState, useTransition } from 'react';
import { IconX } from '@tabler/icons-react';
import { searchArtists } from '@/app/actions/artist';

type ArtistOption = { id: string; name: string; image: string | null };

type Props = {
  value: ArtistOption[];
  onChange: (artists: ArtistOption[]) => void;
};

export function ArtistPickerField({ value, onChange }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ArtistOption[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleQueryChange(q: string) {
    setQuery(q);
    startTransition(async () => {
      const artists = await searchArtists(q);
      setResults(artists.filter(a => !value.some(v => v.id === a.id)));
    });
  }

  function addArtist(artist: ArtistOption) {
    onChange([...value, artist]);
    setQuery('');
    setResults([]);
  }

  function removeArtist(id: string) {
    onChange(value.filter(a => a.id !== id));
  }

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium'>Artists</label>

      <div className='flex flex-wrap gap-1.5'>
        {value.map(artist => (
          <span
            key={artist.id}
            className='flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800'
          >
            {artist.name}
            <button
              type='button'
              onClick={() => removeArtist(artist.id)}
              aria-label={`Remove ${artist.name}`}
            >
              <IconX size={12} />
            </button>
          </span>
        ))}
      </div>

      <div className='relative'>
        <input
          value={query}
          onChange={e => handleQueryChange(e.target.value)}
          placeholder='Search artists…'
          className='w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
        />
        {(results.length > 0 || isPending) && query && (
          <div className='absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900'>
            {isPending ? (
              <div className='px-3 py-2 text-xs text-gray-400'>Searching…</div>
            ) : (
              results.map(artist => (
                <button
                  key={artist.id}
                  type='button'
                  onClick={() => addArtist(artist)}
                  className='block w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800'
                >
                  {artist.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
