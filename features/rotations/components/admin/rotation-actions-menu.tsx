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
  IconPlus,
  IconBellRinging,
  IconCheck,
} from '@tabler/icons-react';

type ActiveRotationMenuProps = {
  onAddAlbums: () => void;
  onEdit: () => void;
  onSendReminder: () => void;
  onFinalize: () => void;
  onDelete: () => void;
};

export function ActiveRotationActionsMenu({
  onAddAlbums,
  onEdit,
  onSendReminder,
  onFinalize,
  onDelete,
}: ActiveRotationMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<button type='button' aria-label='Rotation actions' />}
      >
        <IconDotsVertical size={18} className='text-gray-500 dark:text-white' />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='bg-foreground text-gray-600 dark:text-white w-48'
      >
        <DropdownMenuItem onClick={onAddAlbums} className='h-10 cursor-pointer'>
          <IconPlus size={16} className='mr-1' />
          Add Albums
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onEdit} className='h-10 cursor-pointer'>
          <IconEdit size={16} className='mr-1' />
          Edit Rotation
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onSendReminder}
          className='h-10 cursor-pointer'
        >
          <IconBellRinging size={16} className='mr-1' />
          Send Reminder
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onFinalize}
          className='h-10 cursor-pointer text-ember focus:text-ember'
        >
          <IconCheck size={16} className='mr-1' />
          Finalize Rotation
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDelete}
          className='h-10 cursor-pointer text-red-600 focus:text-red-600'
        >
          <IconTrash size={16} className='mr-1' />
          Delete Rotation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Past rotations are read-only history — no edit, finalize, or reminder,
// since those only make sense while a rotation is still live. Delete is
// kept, but will fail server-side (see deleteRotation) if it has any
// closed albums, so it's really only useful for cleaning up a rotation
// that closed with zero ratings.
export function PastRotationActionsMenu({
  onDelete,
}: {
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<button type='button' aria-label='Rotation actions' />}
      >
        <IconDotsVertical size={18} className='text-gray-500 dark:text-white' />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='bg-foreground text-gray-600 dark:text-white w-40'
      >
        <DropdownMenuItem
          onClick={onDelete}
          className='h-10 cursor-pointer text-red-600 focus:text-red-600'
        >
          <IconTrash size={16} className='mr-1' />
          Delete Rotation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
