// components/admin/admin-albums-view.tsx
'use client';

import AlbumsClient from '@/app/dashboard/albums/albums-client';
import { CreateAlbumDialog } from './dialog/create-album-dialog';
import type { AlbumSummary } from '@/data/albums';
import { AlbumActionsMenu } from './album-actions-menu';
import type { User } from '@/lib/auth';

type AdminAlbumsViewProps = {
  albums: AlbumSummary[];
  currentPage: number;
  totalPages: number;
  user?: User;
};

export default function AdminAlbumsView({
  albums,
  currentPage,
  totalPages,
  user,
}: AdminAlbumsViewProps) {
  return (
    <AlbumsClient
      albums={albums}
      currentPage={currentPage}
      totalPages={totalPages}
      toolbarExtra={<CreateAlbumDialog />}
      renderCardActions={album => <AlbumActionsMenu album={album} />}
      user={user}
    />
  );
}
