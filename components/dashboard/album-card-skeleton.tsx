// components/dashboard/album-card-skeleton.tsx
export default function AlbumCardSkeleton() {
  return (
    <div className='w-full flex flex-col gap-2 animate-pulse'>
      <div className='aspect-square w-full rounded-md bg-gray-200 dark:bg-mist-800' />
      <div className='h-4 w-3/4 rounded bg-gray-200 dark:bg-mist-800' />
      <div className='h-3 w-1/2 rounded bg-gray-200 dark:bg-mist-800' />
    </div>
  );
}
