'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({
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
    <nav className='flex flex-row items-center justify-center gap-2 mt-6 mb-6 text-text-secondary'>
      {currentPage === 1 ? (
        <span className='px-3 py-1 rounded-sm text-sm opacity-40 cursor-not-allowed'>
          Prev
        </span>
      ) : (
        <Link
          href={hrefForPage(currentPage - 1)}
          className='px-3 py-1 rounded-sm text-sm hover:bg-accent-soft hover:text-foreground'
        >
          Prev
        </Link>
      )}

      {pages.map(page => (
        <Link
          key={page}
          href={hrefForPage(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          className={`px-3 py-1 rounded-sm text-sm ${
            page === currentPage
              ? 'bg-ember text-white'
              : 'hover:bg-accent-soft hover:text-foreground'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage === totalPages ? (
        <span className='px-3 py-1 rounded-sm text-sm opacity-40 cursor-not-allowed'>
          Next
        </span>
      ) : (
        <Link
          href={hrefForPage(currentPage + 1)}
          className='px-3 py-1 rounded-sm text-sm hover:bg-accent-soft hover:text-foreground'
        >
          Next
        </Link>
      )}
    </nav>
  );
}
