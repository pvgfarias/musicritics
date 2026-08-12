import { useMemo } from 'react';
import { sortRatings, SortKey } from '@/lib/sort-ratings';
import type { AlbumSummary } from '@/data/albums';

type AlbumFilterParams = {
  query: string | null;
  genre: string | null;
  status: string | null;
  sort: SortKey;
};

export function useAlbumFilters(
  cardsList: AlbumSummary[],
  { query, genre, status, sort }: AlbumFilterParams
) {
  return useMemo(() => {
    const filtered = cardsList.filter(rating => {
      if (query) {
        const q = query.toLowerCase();
        const matchesArtist = rating.artists.some(({ artist }) =>
          artist.name.toLowerCase().includes(q)
        );
        const matchesAlbum = rating.title.toLowerCase().includes(q);
        if (!matchesArtist && !matchesAlbum) return false;
      }
      if (genre && genre !== 'All' && rating.genre !== genre) return false;
      if (status && status !== 'All') {
        if (status === 'Open' && rating.finalized) return false;
        if (status === 'Finalized' && !rating.finalized) return false;
      }
      return true;
    });
    return sortRatings(filtered, sort);
  }, [cardsList, query, status, genre, sort]);
}
