// features/albums/components/filters-panel.tsx
'use client';

import { IconFilter } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import GenreSelector from '@/components/ui/genre-selector';
import AlbumRatedFilter from './album-rated-filter';
import AlbumStatus from './album-status-filter';

type Genre = { name: string; slug: string };

type FiltersPanelProps = {
  genres: Genre[];
  isLoggedIn: boolean;
};

export default function FiltersPanel({
  genres,
  isLoggedIn,
}: FiltersPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCount = [
    searchParams.get('genre'),
    searchParams.get('status'),
    isLoggedIn ? searchParams.get('rated') : null,
  ].filter(Boolean).length;

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('genre');
    params.delete('status');
    params.delete('rated');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

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
        aria-haspopup='dialog'
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
        className='h-10 flex flex-row items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-text-secondary text-sm cursor-pointer hover:text-foreground'
      >
        <IconFilter size={18} />
        <span className='select-none'>Filters</span>
        {activeCount > 0 && (
          <span className='flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-ember text-white text-xs font-medium'>
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute top-full right-0 z-50 mt-2 rounded-md border border-border bg-surface shadow-lg p-4 w-64 flex flex-col gap-4'>
          <div className='flex flex-row items-center justify-between'>
            <span className='text-sm font-medium text-foreground'>Filters</span>
            {activeCount > 0 && (
              <button
                type='button'
                onClick={handleClearAll}
                className='text-xs font-medium text-ember hover:underline cursor-pointer'
              >
                Clear all
              </button>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <span className='text-xs font-medium text-text-secondary'>
              Genre
            </span>
            <GenreSelector genres={genres} />
          </div>

          <div className='flex flex-col gap-1.5'>
            <span className='text-xs font-medium text-text-secondary'>
              Status
            </span>
            <AlbumStatus />
          </div>

          {isLoggedIn && (
            <div className='flex flex-col gap-1.5'>
              <span className='text-xs font-medium text-text-secondary'>
                Your rating
              </span>
              <AlbumRatedFilter />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
