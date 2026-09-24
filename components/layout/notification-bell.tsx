'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { IconBell, IconCheck } from '@tabler/icons-react';
import { useEffect, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import {
  getNotificationBellData,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/features/notifications/actions';
import { formatNotification } from '@/features/notifications/format';
import type { NotificationWithRelations } from '@/features/notifications/queries';

const itemClass =
  'block w-full text-left rounded-md outline-none cursor-pointer select-none data-[highlighted]:bg-sidebar-active';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<
    NotificationWithRelations[] | null
  >(null);
  const [isPending, startTransition] = useTransition();

  // Badge needs a count on load, independent of whether the dropdown is
  // ever opened.
  useEffect(() => {
    let cancelled = false;
    getNotificationBellData().then(data => {
      if (cancelled) return;
      setUnreadCount(data.unreadCount);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Full list only fetched when the dropdown actually opens.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getNotificationBellData().then(data => {
      if (cancelled) return;
      setUnreadCount(data.unreadCount);
      setNotifications(data.notifications);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  function handleItemClick(n: NotificationWithRelations) {
    if (n.read) return;
    setNotifications(prev =>
      prev
        ? prev.map(item => (item.id === n.id ? { ...item, read: true } : item))
        : prev
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    startTransition(() => {
      markNotificationRead(n.id);
    });
  }

  function handleMarkAllRead() {
    setNotifications(prev =>
      prev ? prev.map(item => ({ ...item, read: true })) : prev
    );
    setUnreadCount(0);
    startTransition(() => {
      markAllNotificationsRead();
    });
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type='button'
          aria-label='Notifications'
          className='relative flex items-center justify-center w-9 h-9 rounded-md text-dark-blue dark:text-slate-200 outline-none hover:bg-sidebar-active focus-visible:ring-2 focus-visible:ring-orange-600/50 shrink-0'
        >
          <IconBell size={18} />
          {unreadCount > 0 && (
            <span className='absolute top-1 right-1 min-w-3.5 h-3.5 px-0.5 rounded-full bg-ember text-white text-[10px] leading-3.5 font-medium flex items-center justify-center'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side='bottom'
          align='end'
          sideOffset={18}
          collisionPadding={10}
          className={cn(
            'w-80 rounded-2xl bg-sidebar border border-dark-blue/5 dark:border-white/5',
            'text-dark-blue dark:text-slate-200 shadow-xl',
            'p-1.5 flex flex-col z-1000',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1'
          )}
        >
          <div className='flex items-center justify-between px-2.5 py-2'>
            <span className='text-sm font-medium'>Notifications</span>
            {unreadCount > 0 && (
              <button
                type='button'
                onClick={handleMarkAllRead}
                disabled={isPending}
                className='flex items-center gap-1 rounded text-xs text-gray-500 dark:text-gray-400 outline-none hover:text-ember focus-visible:text-ember disabled:opacity-50'
              >
                <IconCheck size={12} />
                Mark all read
              </button>
            )}
          </div>

          <DropdownMenu.Separator className='-mx-1.5 mb-1.5 h-px bg-dark-blue/10 dark:bg-white/10' />

          <div className='max-h-96 overflow-y-auto flex flex-col gap-0.5'>
            {notifications === null ? (
              <p className='px-2 py-6 text-sm text-center text-gray-500 dark:text-gray-400'>
                Loading…
              </p>
            ) : notifications.length === 0 ? (
              <p className='px-2 py-6 text-sm text-center text-gray-500 dark:text-gray-400'>
                No notifications yet.
              </p>
            ) : (
              notifications.map(n => {
                const { text, href } = formatNotification(n);
                const content = (
                  <div
                    className={cn(
                      'flex items-start gap-2 px-2.5 py-2 rounded-md text-sm',
                      !n.read && 'bg-ember/5'
                    )}
                  >
                    {!n.read && (
                      <span className='mt-1.5 size-1.5 rounded-full bg-ember shrink-0' />
                    )}
                    <span
                      className={cn(
                        n.read
                          ? 'text-gray-500 dark:text-gray-400'
                          : 'font-medium'
                      )}
                    >
                      {text}
                    </span>
                  </div>
                );

                return href ? (
                  <DropdownMenu.Item
                    key={n.id}
                    asChild
                    onSelect={() => handleItemClick(n)}
                  >
                    <Link href={href} className={itemClass}>
                      {content}
                    </Link>
                  </DropdownMenu.Item>
                ) : (
                  <DropdownMenu.Item
                    key={n.id}
                    onSelect={() => handleItemClick(n)}
                    className={itemClass}
                  >
                    {content}
                  </DropdownMenu.Item>
                );
              })
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
