import { AlbumSummary, ArtistReviewSummary } from '@/features/albums/queries';
import { ArtistSummary } from '../../queries';
import { ArtistHeader } from './artist-header';
import { ArtistDiscography } from './artist-discography';
import { ArtistReviews } from './artist-reviews';

export default function ArtistDetails({
  artist,
  albums,
  reviews,
}: {
  artist: ArtistSummary;
  albums: AlbumSummary[];
  reviews: ArtistReviewSummary[];
}) {
  return (
    <div className='flex flex-col gap-8 w-full'>
      <ArtistHeader artist={artist} />
      <ArtistDiscography albums={albums} />
      <ArtistReviews reviews={reviews} />
    </div>
  );
}
