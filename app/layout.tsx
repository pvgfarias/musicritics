import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Raleway, Zilla_Slab, Space_Mono } from 'next/font/google';
import Sidebar from '@/components/layout/sidebar/sidebar';

export const metadata: Metadata = {
  title: 'MusiCritics | Rate and discover new music.',
  description: 'Rate and discover new music.',
};

const raleway = Raleway({
  variable: '--font-raleway-sans',
  subsets: ['latin'],
  style: ['normal'],
  weight: ['500'],
});

const zilla_slab = Zilla_Slab({
  variable: '--font-zilla-slab',
  subsets: ['latin'],
  style: ['normal'],
  weight: ['700'],
});

const space = Space_Mono({
  variable: '--font-space',
  subsets: ['latin'],
  style: ['normal'],
  weight: ['400'],
});

// Runs before hydration so the correct theme class is set on <html>
// before first paint. Keeps `theme` in localStorage in sync with
// system preference when the user hasn't chosen one explicitly.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = saved === 'dark' || (!saved && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${raleway.variable} ${zilla_slab.variable} ${space.variable} antialiased`}
    >
      <head>
        <Script
          id='theme-init'
          strategy='beforeInteractive'
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>

      <body className='flex h-dvh overflow-hidden'>
        <Sidebar />

        <div className='flex flex-col flex-1 min-w-0 h-dvh'>
          <main className='relative flex-1 overflow-y-auto bg-background'>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
