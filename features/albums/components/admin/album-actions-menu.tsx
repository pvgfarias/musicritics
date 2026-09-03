'use client';

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

export function AlbumActionsMenu({
  onEdit,
  toggleAlbumInCurrentRotation,
  onDelete,
  inRotation,
}: AlbumActionsMenuProps) {
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
