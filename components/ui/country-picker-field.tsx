'use client';

import { useMemo, useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { COUNTRIES } from '@/lib/countries';

type Props = {
  value: string | null; // ISO 3166-1 alpha-2 code, e.g. "US"
  onChange: (code: string | null) => void;
};

export function CountryPickerField({ value, onChange }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const selected = value ? COUNTRIES.find(c => c.code === value) : undefined;

  // Static list, filtered in memory — no server round-trip needed, unlike
  // ArtistPickerField/LabelPickerField which query the DB. ~200 entries is
  // small enough to just ship in the bundle and filter as-you-type.
  const results = useMemo(() => {
    if (!query.trim()) return COUNTRIES;
    const q = query.trim().toLowerCase();
    return COUNTRIES.filter(
      c => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q
    );
  }, [query]);

  function select(code: string) {
    onChange(code);
    setQuery('');
    setOpen(false);
  }

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium'>Country</label>

      {selected ? (
        <span className='flex w-fit items-center gap-1.5 rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800'>
          {selected.name}
          <button
            type='button'
            onClick={() => onChange(null)}
            aria-label={`Remove ${selected.name}`}
          >
            <IconX size={12} />
          </button>
        </span>
      ) : (
        <div className='relative'>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 100)}
            placeholder='Search countries…'
            className='w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
          />
          {open && (
            <div className='absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900'>
              {results.length === 0 ? (
                <div className='px-3 py-2 text-xs text-gray-400'>
                  No countries found
                </div>
              ) : (
                results.map(c => (
                  <button
                    key={c.code}
                    type='button'
                    // onMouseDown (not onClick) fires before the input's
                    // onBlur closes the dropdown, so the click still
                    // registers instead of the list vanishing first.
                    onMouseDown={() => select(c.code)}
                    className='block w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800'
                  >
                    {c.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
