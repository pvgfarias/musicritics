'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const OPTIONS = ['All', 'Open', 'Finalized'] as const;
type Status = (typeof OPTIONS)[number];

export default function AlbumStatus() {
  const [status, setStatus] = useState<Status>('All');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleStatusUpdate = (status: Status) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === 'All') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    router.push(`${pathname}?${params.toString()}`);
    setStatus(status);
  };

  return (
    <div className='h-10 w-60 flex flex-row items-center rounded-md border border-gray-300 dark:border-mist-600 bg-gray-50 dark:bg-mist-900 p-1 shadow-sm mb-4 md:mx-0 mx-4'>
      {OPTIONS.map(option => (
        <button
          key={option}
          type='button'
          onClick={() => handleStatusUpdate(option)}
          className={`flex-1 h-full rounded text-sm font-medium transition-colors ${
            status === option
              ? 'bg-white dark:bg-mist-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
