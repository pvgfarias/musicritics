'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    router.push(`?${params.toString()}`);
  }, 300);

  return (
    <div className='flex-1 min-w-0 max-w-120 h-10 flex flex-row justify-start items-center gap-2 p-2 rounded-md border border-gray-300 dark:border-mist-600 bg-foreground text-sm dark:bg-mist-900 placeholder:text-gray-500 text-gray-900 dark:text-white'>
      <IconSearch size={20} className='text-gray-500' />
      <input
        type='search'
        placeholder='Search albums, artists, songs...'
        className='w-full bg-transparent focus:outline-none'
        onChange={e => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}
