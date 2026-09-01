import { AlbumFull } from '@/features/albums/queries';
import { AlbumTrackForRating } from '@/data/tracks';
import AlbumTracksRow from './album-tracks-row';

export default function AlbumTracks({
  album,
  tracks,
}: {
  album: Exclude<AlbumFull, null>;
  tracks: AlbumTrackForRating[];
}) {
  if (!album) return null;

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-row justify-between items-center gap-6'>
        <h2 className='text-2xl font-title text-gray-950 dark:text-white md:text-left text-center grow'>
          Tracklist
        </h2>
        <p className='font-mono text-xs text-gray-600 dark:text-gray-400'>
          {album.tracks.length} tracks
        </p>
      </div>
      <div className='h-px bg-gray-300 dark:bg-slate-800 w-full' />
      <div className='flex flex-col gap-2'>
        {album.tracks.length > 0 ? (
          <ul className='flex flex-col gap-1'>
            {album.tracks.map(track => (
              <li key={track.id}>
                <AlbumTracksRow
                  track={track}
                  userTrackRating={tracks.find(t => t.id === track.id)}
                  finalized={album.finalized}
                />
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
