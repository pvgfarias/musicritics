// lib/sort-ratings.ts
import currentRatings from '@/data/currentRatings';

export type SortKey = 'recent' | 'score-desc' | 'score-asc' | 'az';

export function sortRatings(
  ratings: typeof currentRatings,
  sort: SortKey
): typeof currentRatings {
  const copy = [...ratings]; // never mutate the source array
  switch (sort) {
    case 'score-desc':
      return copy.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    case 'score-asc':
      return copy.sort((a, b) => (a.score ?? -1) - (b.score ?? -1));
    case 'az':
      return copy.sort((a, b) => a.albumName.localeCompare(b.albumName));
    case 'recent':
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
  }
}
