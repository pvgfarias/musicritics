import { AlbumFull } from '@/data/albums';

export default function AlbumTracks({
  album,
}: {
  album: Exclude<AlbumFull, null>;
}) {
  if (!album) return null;

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-2xl font-title text-gray-950 dark:text-white md:text-left text-center'>
          Tracklist
        </h2>
        <p className='font-mono text-xs text-gray-600 dark:text-gray-500'>
          {album.tracks.length} tracks
        </p>
      </div>
      <div className='h-px bg-gray-300 dark:bg-slate-800 w-full' />
      <div className='flex flex-col gap-2'>
        {album.tracks && album.tracks.length > 0 ? (
          <ul className='flex flex-col gap-1'>
            {album.tracks.map((track, index) => (
              <div key={index}>
                <li className='group flex flex-row justify-start items-center py-4 gap-6 hover:bg-orange-100 dark:hover:bg-slate-900 transition-colors'>
                  <span className='font-mono text-xs text-gray-600 dark:text-gray-500 group-hover:text-ember'>
                    {String(track.number).padStart(2, '0')}
                  </span>
                  <span className='text-md font-text text-gray-800 dark:text-gray-200 flex-1'>
                    {track.title}
                  </span>
                  <div className='flex flex-row items-center gap-2.5'>
                    <span className='font-mono text-xs text-gray-600 dark:text-white w-6 text-right'>
                      {track.averageRating ?? '—'}
                    </span>
                    <div className='w-16 h-0.75 bg-gray-300 dark:bg-slate-800 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-ember rounded-full'
                        style={{ width: `${track.averageRating ?? 0}%` }}
                      />
                    </div>
                  </div>
                </li>
                <div className='h-px bg-gray-300 dark:bg-slate-800 w-full' />
              </div>
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
