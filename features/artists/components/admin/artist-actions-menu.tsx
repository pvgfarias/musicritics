'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';

type ArtistActionsMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export function ArtistActionsMenu({
  onEdit,
  onDelete,
}: ArtistActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<button type='button' aria-label='Artist actions' />}
      >
        <IconDotsVertical size={18} className='text-gray-500 dark:text-white' />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className={'bg-foreground text-gray-600 dark:text-white w-36'}
      >
        <DropdownMenuItem onClick={onEdit} className={'h-10 cursor-pointer'}>
          <IconEdit size={16} className='mr-1' />
          Edit Artist
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onDelete}
          className='text-red-600 focus:text-red-600 cursor-pointer'
        >
          <IconTrash size={16} className='mr-1' />
          Delete Artist
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
