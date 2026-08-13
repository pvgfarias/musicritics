'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function AlbumPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const hrefForPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className='flex flex-row items-center justify-center gap-2 mt-6 mb-6 text-gray-500 dark:text-white'>
      <Link
        href={hrefForPage(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`px-3 py-1 rounded-sm text-sm ${
          currentPage === 1
            ? 'pointer-events-none opacity-40'
            : 'hover:bg-gray-200 dark:hover:bg-slate-800'
        }`}
      >
        Prev
      </Link>

      {pages.map(page => (
        <Link
          key={page}
          href={hrefForPage(page)}
          className={`px-3 py-1 rounded-sm text-sm ${
            page === currentPage
              ? 'bg-ember text-white'
              : 'hover:bg-gray-200 dark:hover:bg-slate-800'
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={hrefForPage(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-sm text-sm ${
          currentPage === totalPages
            ? 'pointer-events-none opacity-40'
            : 'hover:bg-gray-200 dark:hover:bg-slate-800'
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
