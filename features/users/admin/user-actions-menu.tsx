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
  IconBan,
  IconBadgeOff,
  IconShieldPlus,
  IconShieldMinus,
  IconTrash,
} from '@tabler/icons-react';
import type { AdminUserSummary } from '@/features/users/queries';

type UserActionsMenuProps = {
  user: AdminUserSummary;
  isSelf: boolean;
  onBan: () => void;
  onUnban: () => void;
  onToggleModerator: () => void;
  onDelete: () => void;
};

export function UserActionsMenu({
  user,
  isSelf,
  onBan,
  onUnban,
  onToggleModerator,
  onDelete,
}: UserActionsMenuProps) {
  // Admins aren't manageable from this panel (no ban/mod-toggle/delete on
  // another admin, and never on yourself) — keeps the menu from offering
  // actions that the server would reject anyway.
  if (isSelf || user.role === 'admin') {
    return (
      <span className='text-xs text-gray-400 dark:text-gray-500 italic'>
        {isSelf ? 'You' : 'Admin'}
      </span>
    );
  }

  const isModerator = user.role === 'moderator';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<button type='button' aria-label='User actions' />}
      >
        <IconDotsVertical size={18} className='text-gray-500 dark:text-white' />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='bg-foreground text-gray-600 dark:text-white w-48'
      >
        <DropdownMenuItem
          onClick={onToggleModerator}
          className='h-10 cursor-pointer'
        >
          {isModerator ? (
            <>
              <IconShieldMinus size={16} className='mr-1' />
              Remove Moderator
            </>
          ) : (
            <>
              <IconShieldPlus size={16} className='mr-1' />
              Make Moderator
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {user.banned ? (
          <DropdownMenuItem onClick={onUnban} className='h-10 cursor-pointer'>
            <IconBadgeOff size={16} className='mr-1' />
            Unban User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onBan} className='h-10 cursor-pointer'>
            <IconBan size={16} className='mr-1' />
            Ban User
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onDelete}
          className='text-red-600 focus:text-red-600 cursor-pointer'
        >
          <IconTrash size={16} className='mr-1' />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
