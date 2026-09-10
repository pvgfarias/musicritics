'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  IconSearch,
  IconDisc,
  IconMicrophone,
  IconUser,
} from '@tabler/icons-react';
import { siteSearchAction } from '@/features/search/actions';
import type { SiteSearchResult } from '@/features/search/queries';
import { sidebarItemClasses } from '@/lib/styles';
import { cn } from '@/lib/utils';

const EMPTY: SiteSearchResult = { albums: [], artists: [], users: [] };

export default function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SiteSearchResult>(EMPTY);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setQuery('');
  }

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Functional update reads the current `open` value from React
        // directly, instead of closing over the `open` from this render —
        // so the effect has nothing external to depend on and the
        // listener only needs to be registered once.
        setOpen(prev => {
          const next = !prev;
          if (!next) setQuery('');
          return next;
        });
      }
    }
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []); // no `open` dependency needed — nothing in here reads it directly

  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => {
      siteSearchAction(query).then(setResults);
    }, 200);
    return () => clearTimeout(timeout);
  }, [open, query]);

  function go(href: string) {
    handleOpenChange(false);
    router.push(href);
  }

  const hasResults =
    results.albums.length > 0 ||
    results.artists.length > 0 ||
    results.users.length > 0;

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className={cn(
          sidebarItemClasses(false),
          'flex items-center gap-3 w-full text-left'
        )}
      >
        <IconSearch size={18} />
        <span>Search</span>
        <kbd className='ml-auto text-xs text-gray-400 dark:text-gray-500 font-mono'>
          ⌘K
        </kbd>
      </button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className='max-w-lg p-0 overflow-hidden'
        >
          <div className='flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 px-4 py-3'>
            <IconSearch size={18} className='text-gray-400 shrink-0' />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='Search albums, artists, users…'
              className='flex-1 bg-transparent outline-none text-sm'
              autoFocus
            />
          </div>

          <div className='max-h-96 overflow-y-auto py-2'>
            {!query ? (
              <p className='px-4 py-6 text-sm text-center text-gray-500 dark:text-gray-400'>
                Start typing to search.
              </p>
            ) : !hasResults ? (
              <p className='px-4 py-6 text-sm text-center text-gray-500 dark:text-gray-400'>
                No results for &quot;{query}&quot;.
              </p>
            ) : (
              <>
                {results.albums.length > 0 && (
                  <ResultGroup icon={<IconDisc size={14} />} label='Albums'>
                    {results.albums.map(a => (
                      <ResultRow
                        key={a.id}
                        onClick={() => go(`/dashboard/albums/${a.slug}`)}
                        image={a.coverImage}
                        title={a.title}
                        subtitle={a.artist}
                      />
                    ))}
                  </ResultGroup>
                )}

                {results.artists.length > 0 && (
                  <ResultGroup
                    icon={<IconMicrophone size={14} />}
                    label='Artists'
                  >
                    {results.artists.map(a => (
                      <ResultRow
                        key={a.id}
                        onClick={() => go(`/dashboard/artists/${a.slug}`)}
                        image={a.image}
                        title={a.name}
                        rounded
                      />
                    ))}
                  </ResultGroup>
                )}

                {results.users.length > 0 && (
                  <ResultGroup icon={<IconUser size={14} />} label='Users'>
                    {results.users.map(u => (
                      <ResultRow
                        key={u.id}
                        onClick={() => go(`/users/${u.username}`)}
                        image={u.image}
                        title={u.displayUsername ?? u.username}
                        rounded
                      />
                    ))}
                  </ResultGroup>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ResultGroup({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className='mb-1'>
      <div className='flex items-center gap-1.5 px-4 py-1 text-xs font-mono uppercase text-gray-400 dark:text-gray-500'>
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

function ResultRow({
  onClick,
  image,
  title,
  subtitle,
  rounded = false,
}: {
  onClick: () => void;
  image: string | null;
  title: string;
  subtitle?: string;
  rounded?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className='flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-800'
    >
      <Image
        src={image ?? '/albums.jpg'}
        alt={title}
        width={32}
        height={32}
        className={rounded ? 'rounded-full shrink-0' : 'rounded-md shrink-0'}
      />
      <div className='flex flex-col min-w-0'>
        <span className='text-sm font-medium truncate'>{title}</span>
        {subtitle && (
          <span className='text-xs text-gray-500 dark:text-gray-400 truncate'>
            {subtitle}
          </span>
        )}
      </div>
    </button>
  );
}
