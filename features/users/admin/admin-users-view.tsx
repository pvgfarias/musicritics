'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from '@/features/auth/auth-client';
import SearchBar from '@/components/ui/search-bar';
import Pagination from '@/components/ui/pagination';
import { UserActionsMenu } from './user-actions-menu';
import { BanUserDialog } from './ban-user-dialog';
import { DeleteUserDialog } from './delete-user-dialog';
import { unbanUser, setModeratorStatus } from '@/features/users/actions';
import { toast } from 'sonner';
import type { AdminUserSummary } from '@/features/users/queries';

type AdminUsersViewProps = {
  users: AdminUserSummary[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
};

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: 'bg-ember/20 text-ember',
    moderator: 'bg-blue-500/20 text-blue-400',
    user: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
        styles[role] ?? styles.user
      }`}
    >
      {role}
    </span>
  );
}

function formatRelativeDate(date: Date | null) {
  if (!date) return 'Never';

  const days = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AdminUsersView({
  users,
  currentPage,
  totalPages,
  totalUsers,
}: AdminUsersViewProps) {
  const { data: session } = useSession();
  const [banningUser, setBanningUser] = useState<AdminUserSummary | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUserSummary | null>(
    null
  );

  async function handleUnban(user: AdminUserSummary) {
    const result = await unbanUser(user.id);
    if (result.success) {
      toast.success(`@${user.username} has been unbanned`);
    } else {
      toast.error(result.error);
    }
  }

  async function handleToggleModerator(user: AdminUserSummary) {
    const makeModerator = user.role !== 'moderator';
    const result = await setModeratorStatus(user.id, makeModerator);
    if (result.success) {
      toast.success(
        makeModerator
          ? `@${user.username} is now a moderator`
          : `@${user.username} is no longer a moderator`
      );
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-row justify-between items-center gap-4'>
          <SearchBar placeholder='Search users...' />
          <span className='text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap'>
            {totalUsers} user{totalUsers === 1 ? '' : 's'}
          </span>
        </div>

        <div className='overflow-x-auto rounded-md border border-gray-200 dark:border-slate-800'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-gray-200 dark:border-slate-800 text-left text-gray-500 dark:text-gray-400'>
                <th className='px-4 py-3 font-medium'>User</th>
                <th className='px-4 py-3 font-medium'>Role</th>
                <th className='px-4 py-3 font-medium'>Status</th>
                <th className='px-4 py-3 font-medium'>Ratings</th>
                <th className='px-4 py-3 font-medium'>Joined</th>
                <th className='px-4 py-3 font-medium'>Last active</th>
                <th className='px-4 py-3 font-medium text-right'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr
                  key={user.id}
                  className='border-b border-gray-100 dark:border-slate-800/60 last:border-0'
                >
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      <Image
                        src={user.image ?? '/user.png'}
                        alt=''
                        width={32}
                        height={32}
                        className='rounded-full object-cover w-8 h-8 shrink-0'
                      />
                      <div className='flex flex-col min-w-0'>
                        <span className='font-medium text-gray-900 dark:text-white truncate'>
                          {user.name || user.displayUsername || user.username}
                        </span>
                        <span className='text-xs text-gray-500 truncate'>
                          @{user.username}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <RoleBadge role={user.role} />
                  </td>
                  <td className='px-4 py-3'>
                    {user.banned ? (
                      <span
                        className='rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400'
                        title={user.banReason ?? undefined}
                      >
                        Banned
                        {user.banExpires
                          ? ` until ${new Date(user.banExpires).toLocaleDateString()}`
                          : ''}
                      </span>
                    ) : (
                      <span className='rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-500'>
                        Active
                      </span>
                    )}
                  </td>
                  <td className='px-4 py-3 text-gray-700 dark:text-gray-300'>
                    {user.ratingCount}
                  </td>
                  <td className='px-4 py-3 text-gray-500 dark:text-gray-400'>
                    {formatRelativeDate(user.createdAt)}
                  </td>
                  <td className='px-4 py-3 text-gray-500 dark:text-gray-400'>
                    {formatRelativeDate(user.lastLoginAt)}
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <UserActionsMenu
                      user={user}
                      isSelf={session?.user.id === user.id}
                      onBan={() => setBanningUser(user)}
                      onUnban={() => handleUnban(user)}
                      onToggleModerator={() => handleToggleModerator(user)}
                      onDelete={() => setDeletingUser(user)}
                    />
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className='px-4 py-8 text-center text-gray-500'
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>

      <BanUserDialog
        userId={banningUser?.id ?? ''}
        username={banningUser?.username}
        open={!!banningUser}
        onOpenChange={open => !open && setBanningUser(null)}
      />
      <DeleteUserDialog
        userId={deletingUser?.id ?? ''}
        username={deletingUser?.username}
        open={!!deletingUser}
        onOpenChange={open => !open && setDeletingUser(null)}
      />
    </>
  );
}
