// components/admin/admin-albums-view.tsx
'use client';

import AlbumsClient from '@/features/albums/components/albums-client';
import { CreateAlbumDialog } from '../dialog/create-album-dialog';
import type { AlbumSummary } from '@/features/albums/queries';
import { AlbumActionsMenu } from './album-actions-menu';

type Genre = { name: string; slug: string };

type AdminAlbumsViewProps = {
  albums: AlbumSummary[];
  currentPage: number;
  totalPages: number;
  genres: Genre[];
};

export default function AdminAlbumsView({
  albums,
  currentPage,
  totalPages,
  genres,
}: AdminAlbumsViewProps) {
  return (
    <AlbumsClient
      albums={albums}
      currentPage={currentPage}
      totalPages={totalPages}
      toolbarExtra={<CreateAlbumDialog />}
      renderCardActions={album => <AlbumActionsMenu album={album} />}
      genres={genres}
    />
  );
}
