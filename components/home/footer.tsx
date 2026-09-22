import Link from 'next/link';

export default function HomeFooter() {
  return (
    <footer className='px-6 py-8 border-t border-gray-200 dark:border-slate-800 text-center'>
      <p className='text-sm text-gray-500 dark:text-gray-400'>
        &copy; {new Date().getFullYear()} MusiCritics. All rights reserved.
      </p>
    </footer>
  );
}
