// lib/use-genre-filter.ts
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

type Genre = { name: string; slug: string };

export function useGenreFilter(genres: Genre[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSlug = searchParams.get('genre') ?? '';
  const currentGenre = genres.find(g => g.slug === currentSlug);

  function selectGenre(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!slug) {
      params.delete('genre');
    } else {
      params.set('genre', slug);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return { currentSlug, currentGenre, selectGenre };
}
