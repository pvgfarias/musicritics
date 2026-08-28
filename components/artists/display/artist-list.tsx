import { ArtistSummary } from '@/data/artists';
import Link from 'next/link';
import ArtistListRow from '../cards/artist-list-row';

export function ArtistList({
  artistList,
  renderCardActions,
}: {
  artistList: ArtistSummary[];
  renderCardActions?: (artist: ArtistSummary) => React.ReactNode;
}) {
  return (
    <>
      {artistList.map(artist => (
        <Link
          key={artist.id}
          href={`/dashboard/artists/${artist.slug}`}
          className='w-full'
        >
          <ArtistListRow
            key={artist.id}
            artist={artist}
            actions={renderCardActions?.(artist)}
          />
        </Link>
      ))}
    </>
  );
}
