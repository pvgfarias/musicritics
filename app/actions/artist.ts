// app/actions/artist.ts
'use server';

import { prisma } from '@/lib/prisma';

export async function searchArtists(query: string) {
  if (!query.trim()) return [];
  return prisma.artist.findMany({
    where: { name: { contains: query, mode: 'insensitive' } },
    select: { id: true, name: true, image: true },
    take: 10,
  });
}
