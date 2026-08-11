'use client';

import { IconChevronDown } from '@tabler/icons-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const genreList = [
  'All',
  'Rock',
  'Indie',
  'Rap',
  'Pop',
  'Kpop',
  'Reggae',
  'Soul',
  'Shoegaze',
  'Experimental',
];

export default function GenreSelector() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const containerRef = useRef<HTMLDivElement>(null);

  const currentGenre = searchParams.get('genre') ?? '';

  const handleGenreUpdate = (genre: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (genre === 'All') {
      params.delete('genre');
    } else {
      params.set('genre', genre);
    }
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className='relative'>
      <button
        type='button'
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
        className='h-10 max-w-40 flex flex-row justify-between items-center rounded-md border border-gray-300 dark:border-slate-800 bg-foreground p-2 gap-1 text-gray-500 text-sm cursor-pointer'
      >
        <span className={`select-none ${currentGenre ? 'text-gray-500' : ''}`}>
          {currentGenre || 'Genre'}
        </span>
        <IconChevronDown
          size={20}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul
          role='listbox'
          className='absolute top-full left-0 z-10 mt-1 rounded-md border border-gray-300 dark:border-slate-800 bg-foreground p-2 w-40 max-h-64 overflow-y-auto shadow-lg flex flex-col gap-1 text-sm'
        >
          {genreList.map(genre => (
            <li
              key={genre}
              role='option'
              aria-selected={
                currentGenre === genre || (genre === 'All' && !currentGenre)
              }
              className='inline-flex items-center w-full cursor-pointer px-2 py-1.5 rounded hover:bg-foreground text-gray-500 hover:text-gray-900 dark:hover:text-white'
              onClick={() => handleGenreUpdate(genre)}
            >
              {genre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
