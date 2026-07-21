'use client';

import { useEffect, useSyncExternalStore } from 'react';
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

  const handleMediaChange = () => callback();

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
  const isDarkMode = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userPrefersDarkTheme = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const savedTheme = window.localStorage.getItem('theme');
    const theme =
      savedTheme === 'dark' || (!savedTheme && userPrefersDarkTheme);

    document.documentElement.classList.toggle('dark', theme);
    window.localStorage.setItem('theme', theme ? 'dark' : 'light');
    window.dispatchEvent(new Event('themechange'));
  }, []);

  const toggleTheme = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const nextTheme = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', nextTheme);
    window.localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
    window.dispatchEvent(new Event('themechange'));
  };

  return (
    <>
      {isDarkMode ? (
        <button
          type='button'
          onClick={toggleTheme}
          className='text-gray-700 dark:text-gray-300 cursor-pointer'
          aria-label='Light Mode'
        >
          <IconSun size={24} />
        </button>
      ) : (
        <button
          type='button'
          onClick={toggleTheme}
          className='text-gray-700 dark:text-gray-300 cursor-pointer'
          aria-label='Dark Mode'
        >
          <IconMoon size={24} />
        </button>
      )}
    </>
  );
}
