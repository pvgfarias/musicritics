import { AlbumFull } from '@/features/albums/queries';
import { AlbumTrackForRating } from '@/features/ratings/queries';
import AlbumTracksRow from './album-tracks-row';
import {
  IconBubble,
  IconMusic,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';

export const ALBUM_TRACK_GRID =
  'grid grid-cols-[1.5rem_1fr_4.5rem_4.5rem_2.5rem_0.5rem] items-center gap-4';

export default function AlbumTracks({
  album,
  tracks,
  userId,
}: {
  album: Exclude<AlbumFull, null>;
  tracks: AlbumTrackForRating[];
  userId: string | undefined;
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
      <div
        className={`${ALBUM_TRACK_GRID} px-2 py-1 text-gray-500 dark:text-gray-300 font-mono text-sm`}
      >
        <div />
        <div className='flex items-center gap-1.5'>
          <IconMusic size={16} /> TRACK
        </div>
        <div className='flex items-center justify-center gap-1.5'>
          <IconUser size={16} /> USER
        </div>
        <div className='flex items-center justify-center gap-1.5'>
          <IconWorld size={16} /> PUBLIC
        </div>
        <div className='flex items-center justify-center gap-1.5'>
          <IconBubble size={16} />
        </div>
        <div />
      </div>
      {album.tracks.length > 0 ? (
        <ul className='list-none m-0 p-0 flex flex-col gap-1'>
          {album.tracks.map(track => (
            <li key={track.id} className='m-0 p-0'>
              <AlbumTracksRow
                track={track}
                userTrackRating={tracks.find(t => t.id === track.id)}
                ratingsArePublic={!album.openForRatings}
                userId={userId}
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
  );
}
