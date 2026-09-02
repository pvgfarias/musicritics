'use server';

import { prisma } from '@/lib/prisma';

export type GenreOption = { id: string; name: string; slug: string };

export async function searchGenres(query: string): Promise<GenreOption[]> {
  const genres = await prisma.genre.findMany({
    where: query
      ? { name: { contains: query, mode: 'insensitive' } }
      : undefined,
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
    take: 20,
  });

  return genres;
}

export async function getTopLevelGenres() {
  return prisma.genre.findMany({
    where: { parentId: null },
    orderBy: { name: 'asc' },
    select: { name: true, slug: true },
  });
}
