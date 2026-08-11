// components/ui/card-grid-skeleton.tsx
import AlbumCardSkeleton from '../dashboard/album-card-skeleton';

export default function CardGridSkeleton({ MAX_CARDS }: { MAX_CARDS: number }) {
  return (
    <div className='grid gap-4 w-full grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 p-4'>
      {Array.from({ length: MAX_CARDS * 2 }).map((_, i) => (
        <AlbumCardSkeleton key={i} />
      ))}
    </div>
  );
}
