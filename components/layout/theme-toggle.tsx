'use client';

import { useSyncExternalStore } from 'react';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

function getServerSnapshot() {
  return false;
}

function getSnapshot() {
  return document.documentElement.classList.contains('dark');
}

function subscribe(callback: () => void) {
  const handleMediaChange = (e: MediaQueryListEvent) => {
    if (!window.localStorage.getItem('theme')) {
      document.documentElement.classList.toggle('dark', e.matches);
      callback();
    }
  };

  // Another tab changed the theme: apply it here too
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key !== 'theme') return;
    const dark =
      event.newValue === 'dark' ||
      (event.newValue === null &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    callback();
  };

  window.addEventListener('themechange', callback);
  window.addEventListener('storage', handleStorageChange);
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', handleMediaChange);

  return () => {
    window.removeEventListener('themechange', callback);
    window.removeEventListener('storage', handleStorageChange);
    mediaQuery.removeEventListener('change', handleMediaChange);
  };
}

export function useIsDarkMode() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setDarkMode(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
  window.localStorage.setItem('theme', dark ? 'dark' : 'light');
  window.dispatchEvent(new Event('themechange'));
}

export function ThemeSwitch({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors',
        checked ? 'bg-orange-600' : 'bg-gray-300 dark:bg-slate-600'
      )}
    >
      <span
        className={cn(
          'size-4 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </span>
  );
}

// Standalone version for use outside the dropdown
export default function ThemeToggle() {
  const isDark = useIsDarkMode();
  const Icon = isDark ? IconSun : IconMoon;

  return (
    <button
      type='button'
      role='switch'
      aria-checked={isDark}
      onClick={() => setDarkMode(!isDark)}
      className='flex items-center gap-2 text-sm'
    >
      <Icon size={20} className='shrink-0' />
      <span className='whitespace-nowrap'>Dark mode</span>
      <ThemeSwitch checked={isDark} />
    </button>
  );
}
