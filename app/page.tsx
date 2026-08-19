'use client';

import Hero from '@/components/home/hero';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
    <section>
      <Hero />
    </section>
  );
}
