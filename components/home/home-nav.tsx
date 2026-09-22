// components/home/nav.tsx
import Link from 'next/link';

export default function HomeNav() {
  return (
    <header className='flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full'>
      <Link href='/' className='text-xl font-bold text-amber-500'>
        MusiCritics
      </Link>

      <nav className='hidden sm:flex items-center gap-6'>
        <Link
          href='/dashboard/albums'
          className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-amber-500'
        >
          Albums
        </Link>
        <Link
          href='/dashboard/artists'
          className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-amber-500'
        >
          Artists
        </Link>
      </nav>

      <div className='flex items-center gap-4'>
        <Link
          href='/login'
          className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-amber-500'
        >
          Sign in
        </Link>
        <Link
          href='/register'
          className='text-sm font-semibold px-4 py-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition'
        >
          Sign up
        </Link>
      </div>
    </header>
  );
}
