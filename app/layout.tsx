import type { Metadata } from 'next';
import './globals.css';
import { Raleway, Quicksand, Space_Mono } from 'next/font/google';
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

const quicksand = Quicksand({
  variable: '--font-quicksand',
  style: ['normal'],
  weight: ['700'],
});

const space = Space_Mono({
  variable: '--font-space',
  subsets: ['latin'],
  style: ['normal'],
  weight: ['400'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${raleway.variable} ${quicksand.variable} ${space.variable} antialiased`}
    >
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
