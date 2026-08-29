// components/admin/admin-artists-view.tsx
'use client';

import { useState } from 'react';
import ArtistsClient from '@/app/dashboard/artists/artists-client';
import { CreateArtistDialog } from './dialog/create-artist-dialog';
import type { ArtistSummary } from '@/data/artists';
import { ArtistActionsMenu } from './artist-actions-menu';
import { EditArtistDialog } from './dialog/edit-artist-dialog';
import { DeleteArtistDialog } from './dialog/delete-artist-dialog';

type AdminArtistsViewProps = {
  artists: ArtistSummary[];
  currentPage: number;
  totalPages: number;
};

export default function AdminArtistsView({
  artists,
  currentPage,
  totalPages,
}: AdminArtistsViewProps) {
  const [editingArtist, setEditingArtist] = useState<ArtistSummary | null>(
    null
  );
  const [deletingArtist, setDeletingArtist] = useState<ArtistSummary | null>(
    null
  );

  return (
    <>
      <ArtistsClient
        artists={artists}
        currentPage={currentPage}
        totalPages={totalPages}
        toolbarExtra={<CreateArtistDialog />}
        renderCardActions={artist => (
          <ArtistActionsMenu
            onEdit={() => setEditingArtist(artist)}
            onDelete={() => setDeletingArtist(artist)}
          />
        )}
      />

      {/* Rendered once, at this top level — never inside a DropdownMenu's
          subtree — so this Dialog's Portal never inherits the dropdown's
          floating-tree registration and doesn't get its clicks silently
          intercepted the way it did when it lived inside ArtistActionsMenu. */}
      <EditArtistDialog
        artist={editingArtist}
        open={!!editingArtist}
        onOpenChange={open => !open && setEditingArtist(null)}
      />
      <DeleteArtistDialog
        artistId={deletingArtist?.id ?? ''}
        artistName={deletingArtist?.name}
        open={!!deletingArtist}
        onOpenChange={open => !open && setDeletingArtist(null)}
      />
    </>
  );
}
