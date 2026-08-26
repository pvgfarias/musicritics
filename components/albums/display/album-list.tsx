import type { AlbumSummary } from '@/data/albums';
import AlbumListRow from '../cards/album-list-row';
import Link from 'next/link';
import type { User } from '@/lib/auth';

export function AlbumList({
  albumList,
  renderCardActions,
  user,
}: {
  albumList: AlbumSummary[];
  renderCardActions?: (album: AlbumSummary) => React.ReactNode;
  user?: User;
}) {
  console.log('Albums - List: ', user);
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
            user={user}
          />
        </Link>
      ))}
    </>
  );
}
