import { ArtistSummary } from '@/data/artists';
import Image from 'next/image';

export default function ArtistListRow({
  artist,
  actions,
}: {
  artist: ArtistSummary;
  actions?: React.ReactNode;
}) {
  return (
    <div
      key={artist.id}
      className='group border-b border-gray-300 dark:border-slate-800
            cursor-pointer
            transition-colors duration-150
            hover:bg-gray-100 dark:hover:bg-slate-900'
    >
      <div className='flex flex-row justify-start items-center gap-2 p-2'>
        <div className='relative w-12.5 h-12.5 shrink-0 overflow-hidden rounded-sm'>
          <Image
            src={
              artist.image?.includes('http')
                ? `${artist.image}`
                : `/${artist.image}`
            }
            alt={`${artist.name}`}
            fill
            className='object-cover transition-transform duration-200 group-hover:scale-105'
          />
        </div>
        <div className='flex flex-col grow'>
          <p className='font-title font-bold text-sm text-dark-blue dark:text-white line-clamp-1 transition-colors duration-150 group-hover:text-orange-500'>
            {artist.name}
          </p>

          <p className='text-xs text-gray-700 dark:text-gray-300 line-clamp-1'>
            {artist.albumsCount} albums.
          </p>
        </div>

        {actions && (
          <div
            className='flex flex-row gap-2 items-center shrink-0 ml-2'
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
