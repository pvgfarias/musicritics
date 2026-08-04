import Image from 'next/image';
import currentRatings from '@/data/currentRatings';
import Link from 'next/link';

type Rating = (typeof currentRatings)[number];

export default function AlbumCard({
  rating,
  priority = false,
}: {
  rating: Rating;
  priority: boolean;
}) {
  return (
    <div className='flex flex-col h-64 w-36 shrink-0 bg-foreground shadow-sm cursor-pointer rounded-xl border border-gray-100 dark:border-foreground-border transition-all duration-200 ease-out hover:-translate-y-1.5 hover:rotate-[-0.4deg] hover:shadow-lg'>
      <div className='relative w-36 h-36 shrink-0'>
        <Image
          src={`/${rating.image}`}
          alt={`${rating.albumName} by ${rating.artistName}`}
          fill
          className='rounded-t-xl object-cover'
          priority={priority}
        />
      </div>

      <div className='flex flex-col p-2.5 justify-start gap-0.5 flex-1'>
        <p className='text-sm font-title font-bold text-dark-blue dark:text-white line-clamp-1'>
          {rating.albumName}
        </p>
        <p className='text-xs text-gray-600 dark:text-gray-300 line-clamp-1'>
          {rating.artistName}
        </p>
        <div className='flex flex-row gap-1'>
          <span className='inline-flex w-fit items-center text-[9px] font-mono uppercase tracking-wide text-gray-600 dark:text-gray-300 bg-gray-300 dark:bg-mist-700 rounded-full px-1.5 py-0.5 mt-1'>
            {rating.releaseYear}
          </span>
          <span className='inline-flex w-fit items-center text-[9px] font-mono uppercase tracking-wide text-gray-600 dark:text-gray-300 bg-gray-300 dark:bg-mist-700 rounded-full px-1.5 py-0.5 mt-1 truncate max-w-16'>
            {rating.genre}
          </span>
        </div>

        {rating.finalized ? (
          <button className='mt-auto bg-transparent font-semibold text-amber-600 border-amber-600 border-2 transition-all duration-200 hover:bg-gray-100 cursor-pointer py-1.5 text-[10px] rounded-md w-full'>
            VIEW
          </button>
        ) : (
          <Link
            href={`/dashboard/albums/${rating.id}`}
            className='mt-auto rounded-lg py-1.5 text-[10px] text-white bg-amber-600 shadow-sm transition-all duration-200 hover:bg-amber-600/90 hover:shadow-md active:scale-[0.98] w-full text-center'
          >
            RATE
          </Link>
        )}
      </div>
    </div>
  );
}
