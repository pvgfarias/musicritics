export type SortKey = 'recent' | 'score-desc' | 'score-asc' | 'az';

export function sortRatings<
  T extends {
    title: string;
    createdAt?: Date | string;
    averageRating?: number | null;
  },
>(ratings: T[], sort: SortKey): T[] {
  const copy = [...ratings];
  switch (sort) {
    case 'score-desc':
      return copy.sort(
        (a, b) => (b.averageRating ?? -1) - (a.averageRating ?? -1)
      );
    case 'score-asc':
      return copy.sort(
        (a, b) => (a.averageRating ?? -1) - (b.averageRating ?? -1)
      );
    case 'az':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case 'recent':
    default:
      return copy.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
  }
}
