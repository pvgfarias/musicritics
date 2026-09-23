'use client';

import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import { useState, useRef, useEffect, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useGenreFilter } from '@/lib/use-genre-filter';
import { searchGenres } from '@/lib/search-genres';

type Genre = { name: string; slug: string };
type GenreOption = { id: string; name: string; slug: string };

export default function GenreSelector({ genres }: { genres: Genre[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GenreOption[]>([]);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { currentSlug, currentGenre, selectGenre } = useGenreFilter(genres);

  const [selectedName, setSelectedName] = useState<string | null>(
    currentGenre?.name ?? null
  );

  const [prevSlug, setPrevSlug] = useState<string | null>(currentSlug);
  if (currentSlug !== prevSlug) {
    setPrevSlug(currentSlug);
    setSelectedName(currentGenre?.name ?? null);
  }

  const runSearch = useDebouncedCallback((q: string) => {
    if (!q) {
      setResults([]);
      return;
    }
    startTransition(async () => {
      const found = await searchGenres(q);
      setResults(found);
    });
  }, 300);

  function handleQueryChange(q: string) {
    setQuery(q);
    runSearch(q);
  }

  function handleGenreUpdate(slug: string | null, name: string | null) {
    selectGenre(slug);
    setSelectedName(name);
    setPrevSlug(slug);
    setQuery('');
    setResults([]);
    runSearch.cancel();
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

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    return () => runSearch.cancel();
  }, [runSearch]);

  const listItems: { name: string; slug: string }[] = query ? results : genres;

  return (
    <div ref={containerRef} className='relative'>
      <button
        type='button'
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
        className='h-10 max-w-40 flex flex-row justify-between items-center rounded-md border border-border bg-surface p-2 gap-1 text-text-secondary text-sm cursor-pointer'
      >
        <span className='select-none truncate'>{selectedName || 'Genre'}</span>
        <IconChevronDown
          size={20}
          className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className='absolute top-full left-0 z-10 mt-1 rounded-md border border-border bg-surface shadow-lg w-56 flex flex-col text-sm'>
          <div className='relative p-2 border-b border-border'>
            <IconSearch
              size={14}
              className='absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none'
            />
            <input
              ref={inputRef}
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              placeholder='Search genres…'
              className='w-full rounded-md border border-border bg-transparent pl-7 pr-2 py-1.5 text-sm text-foreground outline-none focus:border-ember/50'
            />
          </div>

          <ul
            role='listbox'
            className='p-2 max-h-64 overflow-y-auto flex flex-col gap-1'
          >
            {!query && (
              <li
                role='option'
                aria-selected={!currentSlug}
                className='inline-flex items-center w-full cursor-pointer px-2 py-1.5 rounded hover:bg-accent-soft text-text-secondary hover:text-foreground'
                onClick={() => handleGenreUpdate(null, null)}
              >
                All
              </li>
            )}

            {isPending ? (
              <li className='px-2 py-1.5 text-xs text-text-secondary'>
                Searching…
              </li>
            ) : query && listItems.length === 0 ? (
              <li className='px-2 py-1.5 text-xs text-text-secondary'>
                No matches
              </li>
            ) : (
              listItems.map(genre => (
                <li
                  key={genre.slug}
                  role='option'
                  aria-selected={currentSlug === genre.slug}
                  className='inline-flex items-center w-full cursor-pointer px-2 py-1.5 rounded hover:bg-accent-soft text-text-secondary hover:text-foreground'
                  onClick={() => handleGenreUpdate(genre.slug, genre.name)}
                >
                  {genre.name}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
