// components/home/hero.tsx
import Link from 'next/link';

export default function Hero() {
  return (
    <section className='relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center'>
      <div className='relative z-10 max-w-3xl'>
        <h1 className='text-4xl font-bold leading-tight sm:text-5xl md:text-6xl text-gray-900 dark:text-white'>
          Music Counts. <span className='italic text-amber-500'>Track</span>,{' '}
          <span className='italic text-amber-500'>Find</span> and{' '}
          <span className='italic text-amber-500'>discover</span> music.
        </h1>

        <p className='mt-6 text-lg text-gray-700 dark:text-gray-300 sm:text-xl'>
          Rate albums, build your rotations, and follow the artists you love.
        </p>

        <div className='mt-8 flex flex-wrap items-center justify-center gap-4'>
          <Link
            href='/register'
            className='inline-block rounded-full bg-linear-to-r from-slate-900 to-amber-500 px-8 py-3 text-base font-semibold text-white transition hover:opacity-90'
          >
            Start Now
          </Link>
          <Link
            href='/dashboard'
            className='inline-block rounded-full px-8 py-3 text-base font-semibold text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 transition hover:bg-gray-100 dark:hover:bg-slate-800'
          >
            Browse the Site
          </Link>
        </div>

        <p className='mt-4 text-sm text-gray-500 dark:text-gray-400'>
          Already have an account?{' '}
          <Link href='/login' className='text-amber-500 hover:underline'>
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
