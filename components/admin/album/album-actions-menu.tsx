// components/admin/album-actions-menu.tsx
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconRotate,
} from '@tabler/icons-react';
import { type AlbumSummary } from '@/data/albums';
import { toggleRotation } from '@/app/actions/album';
import { DeleteAlbumDialog } from './dialog/delete-album-dialog';
import { EditAlbumDialog } from './dialog/edit-album-dialog';

export function AlbumActionsMenu({ album }: { album: AlbumSummary }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<button type='button' aria-label='Album actions' />}
        >
          <IconDotsVertical
            size={18}
            className='text-gray-500 dark:text-white'
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className={'bg-foreground text-gray-600 dark:text-white w-36'}
        >
          <DropdownMenuItem
            onClick={() => setEditOpen(true)}
            className={'h-10 cursor-pointer'}
          >
            <IconEdit size={16} className='mr-1' />
            Edit Album
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => toggleRotation(album.id, album.finalized)}
            className={'cursor-pointer'}
          >
            <IconRotate size={16} className='mr-1' />
            {!album.finalized ? 'Remove From Rotation' : 'Add To Rotation'}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className='text-red-600 focus:text-red-600 cursor-pointer'
          >
            <IconTrash size={16} className='mr-1' />
            Delete Album
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditAlbumDialog
        album={album}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteAlbumDialog
        albumId={album.id}
        open={deleteOpen}
        albumTitle={album.title}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
