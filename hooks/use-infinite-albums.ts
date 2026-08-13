// hooks/use-infinite-albums.ts
'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchAlbumsPage } from '@/app/actions/albums';
import type { AlbumSummary } from '@/data/albums';

export function useInfiniteAlbums(
  initialAlbums: AlbumSummary[],
  initialHasMore: boolean,
  pageSize: number
) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          const nextPage = page + 1;

          fetchAlbumsPage(nextPage, pageSize).then(result => {
            setAlbums(prev => [...prev, ...result.albums]);
            setPage(nextPage);
            // Adjust if getAlbumsPage returns a totalCount/hasMore field —
            // that's more reliable than inferring from a full page.
            setHasMore(result.albums.length === pageSize);
            setIsLoadingMore(false);
          });
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, page, pageSize]);

  return { albums, hasMore, isLoadingMore, sentinelRef };
}
