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

  const handleMediaChange = (e: MediaQueryListEvent) => {
    if (!window.localStorage.getItem('theme')) {
      document.documentElement.classList.toggle('dark', e.matches);
    }
    callback();
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
      className='flex flex-row uppercase gap-3 cursor-pointer'
      aria-label={label}
    >
      <Icon size={20} className='shrink-0' />
      <p className='opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 whitespace-nowrap'>
        {label}
      </p>
    </button>
  );
}
