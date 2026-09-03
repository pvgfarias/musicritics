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

type AlbumActionsMenuProps = {
  onEdit: () => void;
  toggleAlbumInCurrentRotation: () => void;
  onDelete: () => void;
  inRotation: boolean;
};
// import { type AlbumSummary } from '@/features/albums/queries';
// import { toggleAlbumInCurrentRotation } from '@/features/rotations/actions';
// import { DeleteAlbumDialog } from '../dialog/delete-album-dialog';
// import { EditAlbumDialog } from '../dialog/edit-album-dialog';

export function AlbumActionsMenu({
  onEdit,
  toggleAlbumInCurrentRotation,
  onDelete,
  inRotation,
}: AlbumActionsMenuProps) {
  // const [editOpen, setEditOpen] = useState(false);
  // const [deleteOpen, setDeleteOpen] = useState(false);
  // const [rotationError, setRotationError] = useState<string | null>(null);

  // async function handleToggleRotation() {
  //   setRotationError(null);
  //   const result = await toggleAlbumInCurrentRotation(
  //     album.id,
  //     album.openForRatings
  //   );
  //   if (!result.success) {
  //     // Swap this for your actual toast/notification pattern — kept as a
  //     // plain inline message here so the failure isn't silent.
  //     setRotationError(result.error);
  //   }
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<button type='button' aria-label='Album actions' />}
      >
        <IconDotsVertical size={18} className='text-gray-500 dark:text-white' />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className={'bg-foreground text-gray-600 dark:text-white w-36'}
      >
        <DropdownMenuItem onClick={onEdit} className={'h-10 cursor-pointer'}>
          <IconEdit size={16} className='mr-1' />
          Edit Album
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={toggleAlbumInCurrentRotation}
          className={'cursor-pointer'}
        >
          <IconRotate size={16} className='mr-1' />
          {inRotation ? 'Remove From Rotation' : 'Add To Rotation'}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onDelete}
          className='text-red-600 focus:text-red-600 cursor-pointer'
        >
          <IconTrash size={16} className='mr-1' />
          Delete Album
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
