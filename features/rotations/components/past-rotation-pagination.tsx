'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export default function PastRotationsPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className='flex flex-row items-center justify-center gap-4 mt-4'>
      <button
        type='button'
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className='flex items-center justify-center rounded-md border border-gray-300 dark:border-slate-800 p-1.5 disabled:opacity-40 disabled:cursor-default text-gray-600 dark:text-gray-300'
        aria-label='Previous page'
      >
        <IconChevronLeft size={16} />
      </button>
      <span className='font-mono text-xs text-gray-600 dark:text-gray-400'>
        Page {currentPage} of {totalPages}
      </span>
      <button
        type='button'
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className='flex items-center justify-center rounded-md border border-gray-300 dark:border-slate-800 p-1.5 disabled:opacity-40 disabled:cursor-default text-gray-600 dark:text-gray-300'
        aria-label='Next page'
      >
        <IconChevronRight size={16} />
      </button>
    </div>
  );
}
