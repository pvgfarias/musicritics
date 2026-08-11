import Image from 'next/image';
import currentRatings from '@/data/currentRatings';
import RatingGrade from './rating-grade';
import { useRouter } from 'next/navigation';

type Rating = (typeof currentRatings)[number];

export default function AlbumCard({
  rating,
  priority = false,
}: {
  rating: Rating;
  priority: boolean;
}) {
  const router = useRouter();

  return (
    <div
      className='flex flex-col h-60 w-46 shrink-0 cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1.5 hover:rotate-[-0.4deg] hover:shadow-lg'
      onClick={() => router.push(`dashboard/albums/${rating.id}`)}
    >
      <div className='relative w-46 h-46 shrink-0'>
        <Image
          src={`/${rating.image}`}
          alt={`${rating.albumName} by ${rating.artistName}`}
          fill
          className='rounded-t-sm object-cover'
          priority={priority}
        />
        {rating.myGrade && (
          <RatingGrade ratingGrade={rating.myGrade} inAlbum={true} />
        )}
      </div>
      <div className='flex flex-col p-2.5 justify-start gap-0.5 flex-1'>
        <p className='font-title font-bold text-sm text-dark-blue dark:text-white line-clamp-1'>
          {rating.albumName}
        </p>
        <p className='text-xs text-gray-700 dark:text-gray-300 line-clamp-1'>
          {rating.artistName}
        </p>
      </div>
    </div>
  );
}
