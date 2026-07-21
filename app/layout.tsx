import type { Metadata } from 'next';
import './globals.css';
import { Geist } from 'next/font/google';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'MusiCritics | Rate and discover new music.',
  description: 'Rate and discover new music.',
};

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  style: ['normal'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${geist.variable} antialiased`}>
      <body>
        <Navbar />
        <div className='min-h-screen bg-white dark:bg-slate-950'>
          <main className='relative'>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
