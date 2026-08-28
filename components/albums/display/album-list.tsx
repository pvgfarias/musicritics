import type { AlbumSummary } from '@/data/albums';
import AlbumListRow from '../cards/album-list-row';
import Link from 'next/link';

export function AlbumList({
  albumList,
  renderCardActions,
}: {
  albumList: AlbumSummary[];
  renderCardActions?: (album: AlbumSummary) => React.ReactNode;
}) {
  return (
    <>
      {albumList.map(album => (
        <Link
          key={album.id}
          href={`/dashboard/albums/${album.slug}`}
          className='w-full'
        >
          <AlbumListRow
            key={album.id}
            album={album}
            actions={renderCardActions?.(album)}
          />
        </Link>
      ))}
    </>
  );
}
