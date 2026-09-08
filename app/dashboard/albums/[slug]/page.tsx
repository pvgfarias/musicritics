import AlbumDetails from '@/features/albums/components/details/album-details';
import { getAlbumWithAverageRating } from '@/features/albums/queries';
import { notFound } from 'next/navigation';
import { getAlbumTracksForRating } from '@/features/ratings/queries';
import { auth } from '@/features/auth/auth';
import { headers } from 'next/headers';

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  const album = await getAlbumWithAverageRating(slug, user?.id);
  if (!album) notFound();

  const tracks = user ? await getAlbumTracksForRating(album.id, user.id) : [];

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <AlbumDetails album={album} tracks={tracks} userId={user?.id} />
    </main>
  );
}
