'use client';

import { createPortal } from 'react-dom';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { sidebarItemClasses } from '@/lib/styles';
import { cn } from '@/lib/utils';
import ThemeToggle from './theme-toggle';

const MENU_WIDTH = 240;
const MENU_OFFSET = 10;

export default function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const isMounted = isMenuOpen || menuVisible;

  const closeMenu = () => {
    setMenuVisible(false);
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsMenuOpen(false);
      hideTimeoutRef.current = null;
    }, 200);
  };

  const openMenu = () => {
    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsMenuOpen(true);
    rafRef.current = window.requestAnimationFrame(() => {
      setMenuVisible(true);
      rafRef.current = null;
    });
  };

  useEffect(() => {
    if (!isMounted) return;

    const handleDocumentClick = (event: Event) => {
      const target = event.target as Node | null;
      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      closeMenu();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('touchstart', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('touchstart', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMounted]);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!isMounted || !buttonRef.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight ?? 0;
      const left = Math.min(
        Math.max(MENU_OFFSET, rect.right - MENU_WIDTH),
        window.innerWidth - MENU_WIDTH - MENU_OFFSET
      );
      const aboveTop = rect.top - menuHeight - MENU_OFFSET;
      const belowTop = rect.bottom + MENU_OFFSET;
      const top = aboveTop >= MENU_OFFSET ? aboveTop : belowTop;

      setMenuStyle({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        width: `${MENU_WIDTH}px`,
        zIndex: 1000,
        transformOrigin: top === aboveTop ? 'bottom right' : 'top right',
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isMounted]);

  return (
    <div className='relative'>
      <button
        ref={buttonRef}
        type='button'
        aria-expanded={isMenuOpen}
        aria-haspopup='menu'
        className={cn(
          sidebarItemClasses(false),
          'flex items-center gap-3 w-full overflow-hidden text-left'
        )}
        onClick={() => {
          if (isMenuOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        }}
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

      {isMounted &&
        menuStyle &&
        createPortal(
          <div
            ref={menuRef}
            role='menu'
            className={cn(
              'rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 py-2 px-4 flex flex-col gap-2',
              'transition-opacity duration-200 ease-in-out',
              menuVisible ? 'opacity-100' : 'opacity-0'
            )}
            style={menuStyle}
          >
            {/* <div className='absolute -bottom-2 h-4 w-4 rotate-45 rounded-sm border-r border-b border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-950' /> */}
            <Link
              href='/profile'
              role='menuitem'
              className='flex py-2 items-center gap-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800'
            >
              <IconUser size={18} />
              Profile
            </Link>
            <Link
              href='/settings'
              role='menuitem'
              className='flex py-2 items-center gap-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800'
            >
              <IconSettings size={18} />
              Settings
            </Link>

            <ThemeToggle />

            <div className='mx-4 h-px bg-gray-300 dark:bg-slate-800' />
            <Link
              href='/logout'
              role='menuitem'
              className='flex py-2 items-center gap-2 text-sm font-medium text-red-600 hover:bg-slate-100 dark:text-red-400 dark:hover:bg-slate-800'
            >
              <IconLogout size={18} />
              Sign out
            </Link>
          </div>,
          document.body
        )}
    </div>
  );
}
