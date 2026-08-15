import AlbumDetails from '@/components/albums/details/album-details';
import { getAlbumWithAverageRating } from '@/data/albums';
import { notFound } from 'next/navigation';

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) notFound();

  const album = await getAlbumWithAverageRating(slug);
  if (!album) notFound();

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <AlbumDetails album={album} />
    </main>
  );
}
