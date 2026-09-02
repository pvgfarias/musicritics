'use client';

import { IconChevronDown } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import { useGenreFilter } from '@/lib/use-genre-filter';

type Genre = { name: string; slug: string };

export default function GenreSelector({ genres }: { genres: Genre[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { currentSlug, currentGenre, selectGenre } = useGenreFilter(genres);

  function handleGenreUpdate(slug: string | null) {
    selectGenre(slug);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  return (
    <div ref={containerRef} className='relative'>
      <button
        type='button'
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
        className='h-10 max-w-40 flex flex-row justify-between items-center rounded-md border border-gray-300 dark:border-slate-800 bg-foreground p-2 gap-1 text-gray-500 text-sm cursor-pointer'
      >
        <span className='select-none'>{currentGenre?.name || 'Genre'}</span>
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
          <li
            role='option'
            aria-selected={!currentSlug}
            className='inline-flex items-center w-full cursor-pointer px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-900 dark:hover:text-white'
            onClick={() => handleGenreUpdate(null)}
          >
            All
          </li>
          {genres.map(genre => (
            <li
              key={genre.slug}
              role='option'
              aria-selected={currentSlug === genre.slug}
              className='inline-flex items-center w-full cursor-pointer px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-900 dark:hover:text-white'
              onClick={() => handleGenreUpdate(genre.slug)}
            >
              {genre.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
