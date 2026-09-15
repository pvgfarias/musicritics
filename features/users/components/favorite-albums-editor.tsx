'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { IconX } from '@tabler/icons-react';
import { toast } from 'sonner';
import {
  toggleFavoriteAlbum,
  searchAlbumsForFavorites,
} from '@/features/users/actions';

type FavoriteAlbum = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
};

type AlbumOption = FavoriteAlbum & { artists: { artist: { name: string } }[] };

const MAX_FAVORITES = 10;

export function FavoriteAlbumsEditor({
  initialFavorites,
}: {
  initialFavorites: FavoriteAlbum[];
}) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AlbumOption[]>([]);
  const [isSearching, startSearch] = useTransition();
  const [isPending, startTransition] = useTransition();

  function handleQueryChange(q: string) {
    setQuery(q);
    startSearch(async () => {
      const albums = await searchAlbumsForFavorites(q);
      setResults(albums.filter(a => !favorites.some(f => f.id === a.id)));
    });
  }

  function addAlbum(album: AlbumOption) {
    if (favorites.length >= MAX_FAVORITES) {
      toast.error(`You can only favorite up to ${MAX_FAVORITES} albums.`);
      return;
    }

    startTransition(async () => {
      const result = await toggleFavoriteAlbum(album.id, false);
      if (result.success) {
        setFavorites(prev => [...prev, album]);
        setQuery('');
        setResults([]);
      } else {
        toast.error(result.error);
      }
    });
  }

  function removeAlbum(albumId: string) {
    startTransition(async () => {
      const result = await toggleFavoriteAlbum(albumId, true);
      if (result.success) {
        setFavorites(prev => prev.filter(a => a.id !== albumId));
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium'>
        Favorite albums ({favorites.length}/{MAX_FAVORITES})
      </label>

      <div className='flex flex-wrap gap-2'>
        {favorites.map(album => (
          <div key={album.id} className='relative w-16 shrink-0'>
            <div className='relative w-16 h-16 overflow-hidden rounded-md'>
              <Image
                src={album?.coverImage ?? '/albums.jpg'}
                alt={album.title}
                fill
                className='object-cover'
              />
            </div>
            <button
              type='button'
              onClick={() => removeAlbum(album.id)}
              disabled={isPending}
              aria-label={`Remove ${album.title} from favorites`}
              className='absolute -right-1 -top-1 rounded-full bg-gray-900 p-1 text-white'
            >
              <IconX size={10} />
            </button>
            <p className='mt-1 text-[10px] text-gray-500 line-clamp-1'>
              {album.title}
            </p>
          </div>
        ))}
      </div>

      {favorites.length < MAX_FAVORITES && (
        <div className='relative'>
          <input
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            placeholder='Search albums to favorite…'
            disabled={isPending}
            className='w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900'
          />
          {(results.length > 0 || isSearching) && query && (
            <div className='absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900'>
              {isSearching ? (
                <div className='px-3 py-2 text-xs text-gray-400'>
                  Searching…
                </div>
              ) : (
                results.map(album => (
                  <button
                    key={album.id}
                    type='button'
                    onClick={() => addAlbum(album)}
                    className='flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800'
                  >
                    <span className='truncate'>{album.title}</span>
                    <span className='truncate text-xs text-gray-500'>
                      {album.artists[0]?.artist.name}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
