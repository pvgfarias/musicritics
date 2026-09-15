'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import ThemeToggle from './theme-toggle';
import { useRouter } from 'next/navigation';
import { authClient, useSession } from '@/features/auth/auth-client';

export default function UserMenu() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
          router.refresh();
        },
      },
    });
  }

  if (!user) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type='button'
          className='flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-800'
        >
          <Image
            src={user.image ?? '/user.png'}
            alt={user.name ?? 'User avatar'}
            width={28}
            height={28}
            className='rounded-full shrink-0'
          />
          <span className='hidden sm:inline text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap'>
            {user.displayUsername ?? user.username ?? user.name}
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side='bottom'
          align='end'
          sideOffset={10}
          collisionPadding={10}
          className={cn(
            'w-56 rounded-2xl bg-sidebar border border-dark-blue/5 dark:border-white/5',
            'text-dark-blue dark:text-slate-200 shadow-xl',
            'py-2 px-4 flex flex-col gap-2 z-1000',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1'
          )}
        >
          <DropdownMenu.Item asChild>
            <Link
              href={`/users/${user.username}`}
              className='flex py-2 items-center gap-2 text-sm font-medium rounded-md px-1 outline-none hover:bg-sidebar-active focus-visible:bg-sidebar-active'
            >
              <IconUser size={18} />
              Profile
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href='/settings'
              className='flex py-2 items-center gap-2 text-sm font-medium rounded-md px-1 outline-none hover:bg-sidebar-active focus-visible:bg-sidebar-active'
            >
              <IconSettings size={18} />
              Settings
            </Link>
          </DropdownMenu.Item>

          <div className='px-1'>
            <ThemeToggle />
          </div>

          <div className='mx-4 h-px bg-dark-blue/10 dark:bg-white/10' />

          <DropdownMenu.Item asChild>
            <button
              onClick={handleLogout}
              className='flex py-2 items-center gap-2 text-sm font-medium rounded-md px-1 outline-none text-red-600 hover:bg-sidebar-active dark:text-red-400 focus-visible:bg-sidebar-active'
            >
              <IconLogout size={18} />
              Sign out
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Arrow width={12} height={8} className='fill-sidebar' />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
