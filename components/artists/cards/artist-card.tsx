import { ArtistSummary } from '@/data/artists';
import { User } from '@/lib/auth';
import Image from 'next/image';

export default function ArtistCard({
  artist,
  priority = false,
  actions,
  user,
}: {
  artist: ArtistSummary;
  priority: boolean;
  actions?: React.ReactNode;
  user?: User;
}) {
  return (
    <div
      className='group flex flex-col w-full shrink-0 cursor-pointer rounded-sm mb-2
            transition-all duration-200 ease-out
            hover:-translate-y-1.5 hover:shadow-lg
            bg-transparent hover:bg-gray-100 dark:hover:bg-slate-900'
    >
      <div className='relative w-56 aspect-square shrink-0 overflow-hidden rounded-t-sm'>
        <Image
          src={
            artist.image?.includes('http')
              ? `${artist.image}`
              : `/${artist.image}`
          }
          alt={`${artist.name}`}
          fill
          className='object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]'
          priority={priority}
        />
      </div>
      <div className='flex flex-col p-2.5 justify-start gap-0.5 flex-1'>
        <p className='font-title font-bold text-sm text-dark-blue dark:text-white line-clamp-1 transition-colors duration-200 group-hover:text-orange-500'>
          {artist.name}
        </p>
      </div>
    </div>
  );
}
