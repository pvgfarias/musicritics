'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar({
  placeholder = 'Search albums...',
}: {
  placeholder?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    params.delete('page');
    router.push(`?${params.toString()}`);
  }, 300);

  return (
    <div className='flex-1 min-w-0 max-w-96 h-10 flex flex-row justify-start items-center gap-2 p-2 rounded-md border border-border bg-surface text-sm placeholder:text-text-secondary text-foreground'>
      <IconSearch size={20} className='text-text-secondary' />
      <input
        type='search'
        placeholder={placeholder}
        className='w-full bg-transparent focus:outline-none'
        onChange={e => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}
