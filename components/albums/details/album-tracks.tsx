import { AlbumFull } from '@/data/albums';

export default function AlbumTracks({
  album,
}: {
  album: Exclude<AlbumFull, null>;
}) {
  if (!album) return null;

  return (
    <div className='flex flex-col gap-4 w-full'>
      <h2 className='text-lg font-title font-extrabold text-gray-950 dark:text-white md:text-left text-center'>
        Tracks
      </h2>
      <div className='flex flex-col gap-2'>
        {album.tracks && album.tracks.length > 0 ? (
          <ul className='flex flex-col gap-1'>
            {album.tracks.map((track, index) => (
              <li
                key={index}
                className='flex flex-row justify-between items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
              >
                <span className='text-md font-text text-gray-800 dark:text-gray-200'>
                  {track.title}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-md font-text text-gray-600 dark:text-gray-400'>
            No tracks available for this album.
          </p>
        )}
      </div>
    </div>
  );
}
