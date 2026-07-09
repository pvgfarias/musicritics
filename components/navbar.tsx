import Link from 'next/link';

export default function Navbar() {
  return (
    <div className='w-full bg-midnight h-15 flex justify-between p-8 items-center'>
      <h1
        className={`text-2xl text-mint tracking-wider w-1/4 --font-title antialiased`}
      >
        MusiCritics
      </h1>
      <ul className='flex flex-row gap-4'>
        <li>
          <Link href='/home'>Home</Link>
        </li>
        <li>
          <Link href='/login'>Log In</Link>
        </li>
        <li>
          <Link href='/signup'>Sign Up</Link>
        </li>
      </ul>
    </div>
  );
}
