import type { AlbumFull } from '@/features/albums/queries';
import type { AlbumTrackForRating } from '@/features/ratings/queries';
import AlbumHeader from './album-header';
import AlbumTracks from './album-tracks';
import AlbumReviews from './album-reviews';

export default function AlbumDetails({
  album,
  tracks,
  userId,
}: {
  album: Exclude<AlbumFull, null>;
  tracks: AlbumTrackForRating[];
  userId: string | undefined;
}) {
  return (
    <div className='flex flex-col gap-8 w-full'>
      <AlbumHeader album={album} tracks={tracks} />
      <AlbumTracks album={album} tracks={tracks} userId={userId} />
      <AlbumReviews album={album} />
    </div>
  );
}
