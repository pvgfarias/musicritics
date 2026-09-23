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
    <div className='h-10 w-full flex flex-row items-center rounded-md border border-border bg-surface p-1 gap-1 text-text-secondary text-sm'>
      {RATED_STATUS.map(option => (
        <button
          key={option.value}
          type='button'
          onClick={() => handleRatedUpdate(option.value)}
          className={`flex-1 h-full rounded text-sm font-medium transition-colors cursor-pointer ${
            ratedStatus === option.value
              ? 'bg-ember text-white shadow-sm'
              : 'text-text-secondary hover:text-foreground'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
