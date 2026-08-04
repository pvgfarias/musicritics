import Link from 'next/link';

export default function Hero() {
  return (
    <section className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center text-white bg-amber-50 dark:bg-slate-950'>
      <div className='relative z-10 max-w-3xl'>
        <h1 className='text-4xl font-bold leading-tight sm:text-5xl md:text-6xl text-gray-900 dark:text-white'>
          Music Counts. <span className='italic text-amber-500'>Track</span>,{' '}
          <span className='italic text-amber-500'>Find</span> and{' '}
          <span className='italic text-amber-500'>discover</span> music.
        </h1>

        <p className='mt-6 text-lg text-gray-900 dark:text-white sm:text-xl'>
          Join millions of users. All for free.
        </p>

        <Link
          href='/register'
          className='mt-8 inline-block rounded-full bg-dark-blue px-8 py-3 text-base font-semibold text-white transition hover:bg-amber-500'
        >
          Start Now
        </Link>
      </div>
    </section>
  );
}
