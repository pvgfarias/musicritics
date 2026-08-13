import type { AlbumFull } from '@/data/albums';
import AlbumHeader from './album-header';
import AlbumTracks from './album-tracks';
import AlbumReviews from './album-reviews';

export default function AlbumDetails({
  album,
}: {
  album: Exclude<AlbumFull, null>;
}) {
  return (
    <div className='flex flex-col gap-8 w-full'>
      <AlbumHeader album={album} />
      <AlbumTracks album={album} />
      <AlbumReviews album={album} />
    </div>
  );
}
