'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconMenu2, IconX, IconVinyl } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import SidebarLinks from './sidebar/sidebar-links';
import { adminLinks, adminOnlyLinks, userLinks } from './sidebar/sidebarLinks';
import { useSession } from '@/features/auth/auth-client';

// Returns false on the server and during the first client render (so SSR
// output and initial hydration match), then true from the next render
// onward — without a setState-in-effect mount check. subscribe is a
// no-op because "is this the client" never changes after hydration, so
// there's nothing to actually subscribe to; React just needs a stable
// reference for it.
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const pathname = usePathname();

  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const role = session?.user.role;
  const isPrivileged = role === 'admin' || role === 'moderator';

  const visibleUserLinks = userLinks.filter(
    link => !link.requiresAuth || isAuthenticated
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        aria-label='Open menu'
        className='md:hidden flex items-center justify-center w-9 h-9 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'
      >
        <IconMenu2 size={20} />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  key='overlay'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  className='fixed inset-0 bg-black/50 z-40 md:hidden'
                />
                <motion.div
                  key='panel'
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className='fixed inset-y-0 left-0 w-64 max-w-[80vw] bg-sidebar border-r border-gray-300 dark:border-slate-800 z-50 md:hidden flex flex-col py-2'
                >
                  <div className='flex items-center justify-between pl-4 pr-3 py-3'>
                    <Link
                      href='/'
                      onClick={() => setOpen(false)}
                      className='flex items-center gap-2 text-ember font-title text-xl tracking-wider leading-none'
                    >
                      <IconVinyl size={24} className='shrink-0' />
                      MusiCritics
                    </Link>
                    <button
                      type='button'
                      onClick={() => setOpen(false)}
                      aria-label='Close menu'
                      className='text-gray-500 dark:text-gray-400'
                    >
                      <IconX size={20} />
                    </button>
                  </div>

                  <nav
                    className='flex flex-col gap-2 overflow-y-auto'
                    aria-label='Mobile'
                  >
                    <SidebarLinks links={visibleUserLinks} />

                    {isPrivileged && (
                      <div>
                        <div className='h-px bg-gray-300 dark:bg-slate-800' />
                        <div className='flex flex-col gap-1 pt-4'>
                          <span className='px-2 text-xs uppercase text-gray-500 dark:text-white'>
                            Admin
                          </span>
                          <SidebarLinks
                            links={
                              role === 'admin'
                                ? [...adminLinks, ...adminOnlyLinks]
                                : adminLinks
                            }
                          />
                        </div>
                      </div>
                    )}
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
