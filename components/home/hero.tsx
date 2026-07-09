'use client';

import { Vynil03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { Button, buttonVariants } from '../ui/button';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className='w-3/5 relative text-white'>
      <Image
        alt='albums'
        src='/albums.jpg'
        fill
        className='object-cover absolute inset-0'
      />
      <div
        className={`absolute inset-0 flex flex-col backdrop-blur-sm justify-center items-center font-title`}
      >
        <div
          className={`flex flex-col items-center p-8 gap-4 rounded-xl border-2 bg-gray-600/30 border-amber-50 opacity-0 animate-pop-in drop-shadow-md`}
        >
          <div className='flex flex-row gap-2'>
            {' '}
            <HugeiconsIcon
              icon={Vynil03Icon}
              size={40}
              color='currentColor'
              strokeWidth={1.5}
              className='animate-wiggle'
            />{' '}
            <h1 className='font-title text-4xl'>MUSICRITICS</h1>{' '}
          </div>
          <div className='flex flex-col gap-5 justify-center items-center font-sans text-md'>
            <h1>DISCOVER NEW ARTISTS</h1>
            <h1>SHARE YOUR OPINION</h1>
            <a
              href='/register'
              className={`${buttonVariants({ variant: 'default', size: 'lg' })} px-8 py-6`}
            >
              <span className='font-title text-lg'>sign up</span>
            </a>
            <Link href='/register' className='text-sm'>
              Join now. All for free.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
