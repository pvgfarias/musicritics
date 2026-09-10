import { prisma } from '@/lib/prisma';

export async function siteSearch(query: string, limit = 5) {
  const q = query.trim();
  if (!q) return { albums: [], artists: [], users: [] };

  const [albums, artists, users] = await Promise.all([
    prisma.album.findMany({
      where: { title: { contains: q, mode: 'insensitive' } },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        artists: { select: { artist: { select: { name: true } } } },
      },
    }),
    prisma.artist.findMany({
      where: { name: { contains: q, mode: 'insensitive' } },
      take: limit,
      select: { id: true, name: true, slug: true, image: true },
    }),
    prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: 'insensitive' } },
          { displayUsername: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: limit,
      select: { id: true, username: true, displayUsername: true, image: true },
    }),
  ]);

  return {
    albums: albums.map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      coverImage: a.coverImage,
      artist: a.artists.map(x => x.artist.name).join(', '),
    })),
    artists,
    users,
  };
}

export type SiteSearchResult = Awaited<ReturnType<typeof siteSearch>>;
