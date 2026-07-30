import Image from 'next/image';

export default function UserMenu() {
  return (
    <Image
      src='/jr.jpg'
      height={34}
      width={34}
      alt='profile pic'
      className='rounded-full'
    />
  );
}
