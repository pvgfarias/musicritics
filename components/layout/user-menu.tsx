'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';
import {
  IconLogout,
  IconMoon,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import { setDarkMode, ThemeSwitch, useIsDarkMode } from './theme-toggle';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { authClient, useSession } from '@/features/auth/auth-client';

const itemClass =
  'flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium outline-none cursor-pointer select-none data-[highlighted]:bg-sidebar-active';

export default function UserMenu() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const isDark = useIsDarkMode();

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
          className='flex items-center gap-2 rounded-md px-2 py-1.5 outline-none hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-orange-600/50 dark:hover:bg-slate-800'
        >
          <Image
            src={user.image ?? '/user.png'}
            alt={user.name ?? 'User avatar'}
            width={28}
            height={28}
            className='size-7 shrink-0 rounded-full object-cover'
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
          sideOffset={16}
          collisionPadding={10}
          className={cn(
            'w-56 rounded-2xl bg-sidebar border border-dark-blue/5 dark:border-white/5',
            'text-dark-blue dark:text-slate-200 shadow-xl',
            'p-1.5 flex flex-col z-1000',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1'
          )}
          onCloseAutoFocus={e => e.preventDefault()}
        >
          <DropdownMenu.Item asChild>
            <Link href={`/users/${user.username}`} className={itemClass}>
              <IconUser size={18} />
              Profile
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link href='/settings' className={itemClass}>
              <IconSettings size={18} />
              Settings
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.CheckboxItem
            checked={isDark}
            onCheckedChange={checked => setDarkMode(checked === true)}
            onSelect={e => e.preventDefault()}
            className={itemClass}
          >
            <IconMoon size={18} />
            Dark mode
            <span className='ml-auto'>
              <ThemeSwitch checked={isDark} />
            </span>
          </DropdownMenu.CheckboxItem>

          <DropdownMenu.Separator className='-mx-1.5 my-1.5 h-px bg-dark-blue/10 dark:bg-white/10' />

          <DropdownMenu.Item
            onSelect={handleLogout}
            className={cn(itemClass, 'text-red-600 dark:text-red-400')}
          >
            <IconLogout size={18} />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
