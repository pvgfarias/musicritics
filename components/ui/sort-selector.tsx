// components/ui/sort-selector.tsx
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  IconChevronDown,
  IconArrowUp,
  IconArrowDown,
} from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import {
  SortField,
  SortDirection,
  defaultDirectionForField,
} from '@/lib/sort-ratings';

const fieldOptions: { value: SortField; label: string }[] = [
  { value: 'recent', label: 'Most recent' },
  { value: 'public-score', label: 'Public score' },
  { value: 'user-score', label: 'Your score' },
  { value: 'az', label: 'A–Z' },
];

export default function SortSelector({
  defaultField = 'recent',
}: {
  defaultField?: SortField;
} = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentField = (searchParams.get('sort') as SortField) ?? defaultField;
  const currentDirection =
    (searchParams.get('dir') as SortDirection) ??
    defaultDirectionForField[currentField];

  const currentLabel =
    fieldOptions.find(o => o.value === currentField)?.label ?? 'Sort';

  const updateParams = (field: SortField, direction: SortDirection) => {
    const params = new URLSearchParams(searchParams.toString());

    if (field === defaultField) {
      params.delete('sort');
    } else {
      params.set('sort', field);
    }

    if (direction === defaultDirectionForField[field]) {
      params.delete('dir');
    } else {
      params.set('dir', direction);
    }

    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFieldSelect = (field: SortField) => {
    updateParams(field, defaultDirectionForField[field]);
    setIsOpen(false);
  };

  const handleDirectionToggle = () => {
    updateParams(currentField, currentDirection === 'asc' ? 'desc' : 'asc');
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

  const directionLabel =
    currentField === 'az'
      ? currentDirection === 'asc'
        ? 'A to Z'
        : 'Z to A'
      : currentField === 'recent'
        ? currentDirection === 'desc'
          ? 'Newest first'
          : 'Oldest first'
        : currentDirection === 'desc'
          ? 'High to low'
          : 'Low to high';

  return (
    <div className='flex flex-row gap-2'>
      <div ref={containerRef} className='flex-1 relative'>
        <button
          type='button'
          aria-haspopup='listbox'
          aria-expanded={isOpen}
          onClick={() => setIsOpen(prev => !prev)}
          className='h-10 max-w-40 flex flex-row justify-between items-center rounded-md border border-border bg-surface p-2 gap-1 text-text-secondary text-sm cursor-pointer'
        >
          <span className='select-none'>{currentLabel}</span>
          <IconChevronDown size={20} className={isOpen ? 'rotate-180' : ''} />
        </button>
        {isOpen && (
          <ul
            role='listbox'
            className='absolute top-full left-0 z-10 mt-1 rounded-md border border-border bg-surface p-2 w-40 shadow-lg flex flex-col gap-1 text-sm'
          >
            {fieldOptions.map(opt => (
              <li
                key={opt.value}
                role='option'
                aria-selected={currentField === opt.value}
                className='cursor-pointer px-2 py-1.5 rounded hover:bg-accent-soft text-text-secondary hover:text-foreground'
                onClick={() => handleFieldSelect(opt.value)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type='button'
        onClick={handleDirectionToggle}
        title={directionLabel}
        aria-label={directionLabel}
        className='h-10 w-10 flex items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:text-foreground cursor-pointer'
      >
        {currentDirection === 'desc' ? (
          <IconArrowDown size={18} />
        ) : (
          <IconArrowUp size={18} />
        )}
      </button>
    </div>
  );
}
