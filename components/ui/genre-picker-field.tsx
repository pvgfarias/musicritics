'use client';

import { useState, useTransition } from 'react';
import { IconX } from '@tabler/icons-react';
import { searchGenres } from '@/lib/search-genres';

type GenreOption = { id: string; name: string; slug: string };

type Props = {
  value: GenreOption[];
  onChange: (genres: GenreOption[]) => void;
};

export function GenrePickerField({ value, onChange }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GenreOption[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleQueryChange(q: string) {
    setQuery(q);
    startTransition(async () => {
      const genres = await searchGenres(q);
      setResults(genres.filter(g => !value.some(v => v.id === g.id)));
    });
  }

  function addGenre(genre: GenreOption) {
    onChange([...value, genre]);
    setQuery('');
    setResults([]);
  }

  function removeGenre(id: string) {
    onChange(value.filter(g => g.id !== id));
  }

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium'>Genres</label>

      <div className='flex flex-wrap gap-1.5'>
        {value.map(genre => (
          <span
            key={genre.id}
            className='flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800'
          >
            {genre.name}
            <button
              type='button'
              onClick={() => removeGenre(genre.id)}
              aria-label={`Remove ${genre.name}`}
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
          placeholder='Search genres…'
          className='w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
        />
        {(results.length > 0 || isPending) && query && (
          <div className='absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900'>
            {isPending ? (
              <div className='px-3 py-2 text-xs text-gray-400'>Searching…</div>
            ) : (
              results.map(genre => (
                <button
                  key={genre.id}
                  type='button'
                  onClick={() => addGenre(genre)}
                  className='block w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800'
                >
                  {genre.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
