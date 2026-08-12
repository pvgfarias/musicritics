import Image from 'next/image';
import RatingGrade from './rating-grade';
import { useRouter } from 'next/navigation';
import type { AlbumSummary } from '@/data/albums';

export default function AlbumCard({
  album,
  priority = false,
}: {
  album: AlbumSummary;
  priority: boolean;
}) {
  const router = useRouter();

  return (
    <div
      className='flex flex-col h-60 w-46 shrink-0 cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1.5 hover:rotate-[-0.4deg] hover:shadow-lg mb-2'
      onClick={() => router.push(`dashboard/albums/${album.id}`)}
    >
      <div className='relative w-46 h-46 shrink-0'>
        <Image
          src={album.coverImage ? `/${album.coverImage}` : '/albums.jpg'}
          alt={`${album.title} by ${album.artists[0]?.artist.name}`}
          fill
          className='rounded-t-sm object-cover'
          priority={priority}
        />
        {album.averageRating && (
          <RatingGrade ratingGrade={album.averageRating} inAlbum={true} />
        )}
      </div>
      <div className='flex flex-col p-2.5 justify-start gap-0.5 flex-1'>
        <p className='font-title font-bold text-sm text-dark-blue dark:text-white line-clamp-1'>
          {album.title}
        </p>
        <p className='text-xs text-gray-700 dark:text-gray-300 line-clamp-1'>
          {album.artists[0]?.artist.name}
        </p>
        <p className='text-xs text-gray-700 dark:text-gray-300 line-clamp-1'>
          {album.ratingCount} ratings.
        </p>
      </div>
    </div>
  );
}
