'use client';

import { useSyncExternalStore } from 'react';
import { IconMoon, IconSun } from '@tabler/icons-react';

function getServerSnapshot() {
  return false;
}

function getSnapshot() {
  if (typeof window === 'undefined') {
    return false;
  }

  return document.documentElement.classList.contains('dark');
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  const handleMediaChange = (e: MediaQueryListEvent) => {
    if (!window.localStorage.getItem('theme')) {
      document.documentElement.classList.toggle('dark', e.matches);
      callback();
    }
  };

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'theme') callback();
  };

  const handleThemeChange = () => callback();

  window.addEventListener('themechange', handleThemeChange);
  window.addEventListener('storage', handleStorageChange);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', handleMediaChange);

  return () => {
    window.removeEventListener('themechange', handleThemeChange);
    window.removeEventListener('storage', handleStorageChange);
    mediaQuery.removeEventListener('change', handleMediaChange);
  };
}

export default function ThemeToggle() {
  // Reads the class already set by the blocking script in the root
  // layout <head> — this component no longer sets the initial theme
  // itself, so mounting it (e.g. opening a dropdown) can't change it.
  const isDarkMode = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const toggleTheme = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const nextTheme = !isDarkMode;
    document.documentElement.classList.toggle('dark', nextTheme);
    window.localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
    window.dispatchEvent(new Event('themechange'));
  };

  const Icon = isDarkMode ? IconSun : IconMoon;
  const label = isDarkMode ? 'Light Mode' : 'Dark Mode';

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className='text-sm flex items-center gap-2'
      aria-label={label}
    >
      <Icon size={20} className='shrink-0' />
      <p className='whitespace-nowrap'>{label}</p>
      <input
        type='checkbox'
        checked={isDarkMode}
        onChange={toggleTheme}
        className='toggle toggle-sm'
      />
    </button>
  );
}
