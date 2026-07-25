import type { Metadata } from 'next';
import './globals.css';
import { Raleway, Libre_Caslon_Text, Space_Mono } from 'next/font/google';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'MusiCritics | Rate and discover new music.',
  description: 'Rate and discover new music.',
};

const raleway = Raleway({
  variable: '--font-raleway-sans',
  subsets: ['latin'],
  style: ['normal'],
  weight: ['700'],
});

const libre = Libre_Caslon_Text({
  variable: '--font-libre',
  subsets: ['latin'],
  style: ['normal'],
  weight: ['700'],
});

const space = Space_Mono({
  variable: '--font-space',
  subsets: ['latin'],
  style: ['normal'],
  weight: ['700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoggedIn = true;

  return (
    <html
      lang='en'
      className={`${raleway.variable} ${libre.variable} ${space.variable} antialiased`}
    >
      <body>
        {!isLoggedIn && <Navbar />}

        <main className='relative'>{children}</main>

        {!isLoggedIn && <Footer />}
      </body>
    </html>
  );
}
