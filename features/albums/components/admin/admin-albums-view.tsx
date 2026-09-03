// components/admin/admin-albums-view.tsx
'use client';

import AlbumsClient from '@/features/albums/components/albums-client';
import { CreateAlbumDialog } from '../dialog/create-album-dialog';
import type { AlbumSummary } from '@/features/albums/queries';
import { AlbumActionsMenu } from './album-actions-menu';
import { EditAlbumDialog } from '../dialog/edit-album-dialog';
import { DeleteAlbumDialog } from '../dialog/delete-album-dialog';
import { toggleAlbumInCurrentRotation } from '@/features/rotations/actions';
import { useState } from 'react';

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
  const [editingAlbum, setEditingAlbum] = useState<AlbumSummary | null>(null);
  const [deletingAlbum, setDeletingAlbum] = useState<AlbumSummary | null>(null);

  return (
    <>
      <AlbumsClient
        albums={albums}
        currentPage={currentPage}
        totalPages={totalPages}
        toolbarExtra={<CreateAlbumDialog />}
        renderCardActions={album => (
          <AlbumActionsMenu
            onEdit={() => setEditingAlbum(album)}
            onDelete={() => setDeletingAlbum(album)}
            toggleAlbumInCurrentRotation={() =>
              toggleAlbumInCurrentRotation(album.id, album.openForRatings)
            }
            inRotation={album.openForRatings}
          />
        )}
        genres={genres}
      />

      <EditAlbumDialog
        album={editingAlbum}
        open={!!editingAlbum}
        onOpenChange={open => !open && setEditingAlbum(null)}
      />
      <DeleteAlbumDialog
        albumId={deletingAlbum?.id ?? ''}
        open={!!deletingAlbum}
        albumTitle={deletingAlbum?.title}
        onOpenChange={open => !open && setDeletingAlbum(null)}
      />
    </>
  );
}
