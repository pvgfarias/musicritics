import type { AlbumFull } from '@/features/albums/queries';
import type { AlbumTrackForRating } from '@/features/ratings/queries';
import AlbumHeader from './album-header';
import AlbumTracks from './album-tracks';
import AlbumReviews from './album-reviews';

type AlbumUserRating = Exclude<AlbumFull, null>['ratings'][number];

export default function AlbumDetails({
  album,
  tracks,
  userRating,
}: {
  album: Exclude<AlbumFull, null>;
  tracks: AlbumTrackForRating[];
  userRating: AlbumUserRating | undefined;
}) {
  return (
    <div className='flex flex-col gap-8 w-full'>
      <AlbumHeader album={album} tracks={tracks} userRating={userRating} />
      <AlbumTracks album={album} tracks={tracks} />
      <AlbumReviews album={album} />
    </div>
  );
}
