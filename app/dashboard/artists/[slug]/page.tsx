import { notFound } from 'next/navigation';
import { auth } from '@/features/auth/auth';
import { headers } from 'next/headers';
import { getArtistBySlug } from '@/features/artists/queries';
import {
  getAlbumsByArtist,
  getRecentReviewsByArtist,
} from '@/features/albums/queries';
import ArtistDetails from '@/features/artists/components/details/artist-details';

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  const artist = await getArtistBySlug(slug, user?.id);
  if (!artist) notFound();

  const page = 1;
  const pageSize = 15;

  const { albums } = await getAlbumsByArtist(
    artist.id,
    page,
    pageSize,
    user?.id
  );

  const reviews = await getRecentReviewsByArtist(artist.id, 5);

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <ArtistDetails artist={artist} albums={albums} reviews={reviews} />
    </main>
  );
}
