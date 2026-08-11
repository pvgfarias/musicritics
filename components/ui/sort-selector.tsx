// components/ui/sort-selector.tsx
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { IconChevronDown } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import { SortKey } from '@/lib/sort-ratings';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'recent', label: 'Most recent' },
  { value: 'score-desc', label: 'Highest rated' },
  { value: 'score-asc', label: 'Lowest rated' },
  { value: 'az', label: 'A–Z' },
];

export default function SortSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSort = searchParams.get('sort') ?? 'recent';
  const currentLabel =
    sortOptions.find(o => o.value === currentSort)?.label ?? 'Sort';

  const handleSortUpdate = (sort: SortKey) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === 'recent') {
      params.delete('sort');
    } else {
      params.set('sort', sort);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className='relative'>
      <button
        type='button'
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
        className='h-10 w-40 flex flex-row justify-between items-center rounded-md border border-gray-300 dark:border-mist-600 bg-gray-50 dark:bg-mist-900 px-4 py-3 shadow-sm text-gray-500 text-base cursor-pointer'
      >
        <span className='select-none'>{currentLabel}</span>
        <IconChevronDown size={20} className={isOpen ? 'rotate-180' : ''} />
      </button>
      {isOpen && (
        <ul
          role='listbox'
          className='absolute top-full left-0 z-10 mt-1 rounded-md border border-gray-300 dark:border-mist-600 bg-gray-50 dark:bg-mist-900 p-2 w-40 shadow-lg flex flex-col gap-1 text-sm'
        >
          {sortOptions.map(opt => (
            <li
              key={opt.value}
              role='option'
              aria-selected={currentSort === opt.value}
              className='cursor-pointer px-2 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-mist-700'
              onClick={() => handleSortUpdate(opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
