'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const ALBUM_STATUS = [
  { value: 'All', label: 'All' },
  { value: 'InRotation', label: 'Open' },
  { value: 'NotInRotation', label: 'Closed' },
] as const;

export type AlbumStatus = (typeof ALBUM_STATUS)[number]['value'];

export default function AlbumStatusFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = (searchParams.get('status') as AlbumStatus) ?? 'All';

  const handleStatusUpdate = (value: AlbumStatus) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'All') {
      params.delete('status');
    } else {
      params.set('status', value);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className='h-10 w-60 flex flex-row items-center rounded-md border border-gray-300 dark:border-slate-800 bg-foreground p-1 gap-1 text-gray-500 text-sm cursor-pointer'>
      {ALBUM_STATUS.map(option => (
        <button
          key={option.value}
          type='button'
          onClick={() => handleStatusUpdate(option.value)}
          className={`flex-1 h-full rounded text-sm font-medium transition-colors ${
            status === option.value
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
