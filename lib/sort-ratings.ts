export type SortField = 'recent' | 'public-score' | 'user-score' | 'az';
export type SortDirection = 'asc' | 'desc';

export const defaultDirectionForField: Record<SortField, SortDirection> = {
  recent: 'desc',
  'public-score': 'desc',
  'user-score': 'desc',
  az: 'asc',
};

export function sortRatings<
  T extends {
    title: string;
    createdAt?: Date | string;
    averageRating?: number | null;
    userRating?: number | null;
  },
>(
  ratings: T[],
  field: SortField,
  direction: SortDirection = defaultDirectionForField[field]
): T[] {
  const copy = [...ratings];
  const dir = direction === 'asc' ? 1 : -1;

  switch (field) {
    case 'public-score':
      return copy.sort(
        (a, b) => dir * ((a.averageRating ?? -1) - (b.averageRating ?? -1))
      );

    case 'user-score':
      // unrated (null/undefined) always sorts last, regardless of direction
      return copy.sort((a, b) => {
        const aRated = a.userRating != null;
        const bRated = b.userRating != null;
        if (!aRated && !bRated) return 0;
        if (!aRated) return 1;
        if (!bRated) return -1;
        return dir * (a.userRating! - b.userRating!);
      });

    case 'az':
      return copy.sort((a, b) => dir * a.title.localeCompare(b.title));

    case 'recent':
    default:
      return copy.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dir * (bTime - aTime);
      });
  }
}
