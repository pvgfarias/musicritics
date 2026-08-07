'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { sidebarItemClasses } from '@/lib/styles';
import { cn } from '@/lib/utils';
import ThemeToggle from './theme-toggle';

// npm install @radix-ui/react-dropdown-menu

export default function UserMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type='button'
          className={cn(
            sidebarItemClasses(false),
            'flex items-center gap-3 w-full overflow-hidden text-left'
          )}
        >
          <Image
            src='/jr.jpg'
            alt='User avatar'
            width={32}
            height={32}
            className='rounded-full shrink-0'
          />
          <span className='whitespace-nowrap truncate'>User Name</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side='right'
          align='end'
          sideOffset={14}
          collisionPadding={10}
          className={cn(
            'w-60 rounded-2xl bg-sidebar border border-dark-blue/5 dark:border-white/5',
            'text-dark-blue dark:text-slate-200 shadow-xl',
            'py-2 px-4 flex flex-col gap-2 z-[1000]',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[side=right]:slide-in-from-left-1 data-[side=left]:slide-in-from-right-1'
          )}
        >
          <DropdownMenu.Item asChild>
            <Link
              href='/profile'
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

          {/* Not a Link/button, so it doesn't need menu-item keyboard behavior */}
          <div className='px-1'>
            <ThemeToggle />
          </div>

          <div className='mx-4 h-px bg-dark-blue/10 dark:bg-white/10' />

          <DropdownMenu.Item asChild>
            <Link
              href='/logout'
              className='flex py-2 items-center gap-2 text-sm font-medium rounded-md px-1 outline-none text-red-600 hover:bg-sidebar-active dark:text-red-400 focus-visible:bg-sidebar-active'
            >
              <IconLogout size={18} />
              Sign out
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Arrow width={12} height={8} className='fill-sidebar' />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
