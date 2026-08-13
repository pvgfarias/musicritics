import type { AlbumSummary } from '@/data/albums';
import AlbumListRow from '../cards/album-list-row';
import Link from 'next/link';

export function AlbumList({ albumList }: { albumList: AlbumSummary[] }) {
  return (
    <>
      {albumList.map(album => (
        <Link
          key={album.id}
          href={`/dashboard/albums/${album.slug}`}
          className='w-full md:pt-4'
        >
          <AlbumListRow key={album.id} album={album} />
        </Link>
      ))}
    </>
  );
}
