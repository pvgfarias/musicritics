'use client';

import { useState, useTransition } from 'react';
import { IconX } from '@tabler/icons-react';
import { searchArtists } from '@/features/artists/actions';

type ArtistRole = 'PRIMARY' | 'FEATURED' | 'PRODUCER';

type ArtistOption = {
  id: string;
  name: string;
  image: string | null;
  role?: ArtistRole;
};

const ROLE_OPTIONS: { value: ArtistRole; label: string }[] = [
  { value: 'PRIMARY', label: 'Primary' },
  { value: 'FEATURED', label: 'Featured' },
  { value: 'PRODUCER', label: 'Producer' },
];

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
    // New additions default to PRIMARY — matches useAlbumForm's fallback,
    // kept explicit here too so the chip has a defined role to render
    // immediately instead of showing blank until the next change.
    onChange([...value, { ...artist, role: artist.role ?? 'PRIMARY' }]);
    setQuery('');
    setResults([]);
  }

  function removeArtist(id: string) {
    onChange(value.filter(a => a.id !== id));
  }

  function changeRole(id: string, role: ArtistRole) {
    onChange(value.map(a => (a.id === id ? { ...a, role } : a)));
  }

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium'>Artists</label>

      <div className='flex flex-wrap gap-1.5'>
        {value.map(artist => (
          <span
            key={artist.id}
            className='flex items-center gap-1.5 rounded-full bg-gray-100 py-1 pl-2 pr-1 text-xs dark:bg-gray-800'
          >
            {artist.name}
            <select
              value={artist.role ?? 'PRIMARY'}
              onChange={e =>
                changeRole(artist.id, e.target.value as ArtistRole)
              }
              // Stop the select's own click/mousedown from bubbling up to
              // any outer form/dropdown-close handlers — same defensive
              // pattern as the actions overlay in AlbumCard.
              onClick={e => e.stopPropagation()}
              className='rounded-full border-none bg-gray-200 px-1.5 py-0.5 text-[11px] dark:bg-gray-700'
            >
              {ROLE_OPTIONS.map(r => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <button
              type='button'
              onClick={() => removeArtist(artist.id)}
              aria-label={`Remove ${artist.name}`}
              className='shrink-0'
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
