// app/(marketing)/page.tsx  (or wherever Home lives)
'use client';

import Hero from '@/components/home/hero';
import Features from '@/components/home/features';
import HomeFooter from '@/components/home/footer';
import { useSession } from '@/features/auth/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import HomeNav from '@/components/home/home-nav';

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.replace('/dashboard');
    }
  }, [session, router]);

  if (isPending || session?.user) {
    return null;
  }

  return (
    <div className='bg-amber-50 dark:bg-slate-950 min-h-screen flex flex-col'>
      <HomeNav />
      <main className='flex-1'>
        <Hero />
        <Features />
      </main>
      <HomeFooter />
    </div>
  );
}
