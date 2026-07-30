import type { Metadata } from 'next';
import './globals.css';
import { Raleway, Quicksand, Space_Mono } from 'next/font/google';
import Navbar from '@/components/layout/navbar';
import Sidebar from '@/components/layout/sidebar';

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

const carter = Quicksand({
  variable: '--font-carter',
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
      className={`${raleway.variable} ${carter.variable} ${space.variable} antialiased`}
    >
      <body className='flex h-dvh overflow-hidden'>
        <Sidebar />
        <div className='flex flex-col flex-1 min-w-0 h-dvh'>
          <Navbar />
          <main className='relative flex-1 overflow-y-auto'>{children}</main>
        </div>
      </body>
    </html>
  );
}
