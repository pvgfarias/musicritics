'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('query', term);
    router.push(`?${params.toString()}`); // Updates the URL and shares state
  }, 300);

  return (
    <div className='h-12 w-100 flex flex-row justify-center items-center rounded-md border border-gray-300 dark:border-mist-600 bg-gray-50 dark:bg-mist-900 px-4 py-3 md:mx-0 mx-4 shadow-sm mb-4 placeholder:text-gray-500 text-gray-900 text-base'>
      <input
        type='search'
        placeholder='Search'
        className='w-full bg-transparent focus:outline-none'
        onChange={e => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <IconSearch size={20} className='text-gray-500' />
    </div>
  );
}
