'use client';

import Hero from '../components/home/hero';
import Login from '../components/home/login';

export default function Home() {
  return (
    <main className='flex flex-row grow'>
      <Hero />
      <Login />
    </main>
  );
}
