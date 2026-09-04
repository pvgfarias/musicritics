'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const RATED_STATUS = [
  { value: 'All', label: 'All' },
  { value: 'Rated', label: 'Rated' },
  { value: 'Unrated', label: 'Unrated' },
] as const;

export type RatedStatus = (typeof RATED_STATUS)[number]['value'];

export default function AlbumRatedFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const ratedStatus = (searchParams.get('rated') as RatedStatus) ?? 'All';

  const handleRatedUpdate = (value: RatedStatus) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'All') {
      params.delete('rated');
    } else {
      params.set('rated', value);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className='h-10 w-60 flex flex-row items-center rounded-md border border-gray-300 dark:border-slate-800 bg-foreground p-1 gap-1 text-gray-500 text-sm cursor-pointer'>
      {RATED_STATUS.map(option => (
        <button
          key={option.value}
          type='button'
          onClick={() => handleRatedUpdate(option.value)}
          className={`flex-1 h-full rounded text-sm font-medium transition-colors ${
            ratedStatus === option.value
              ? 'bg-ember text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
