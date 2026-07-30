import Image from 'next/image';

export default function UserMenu() {
  return (
    <button type='button' aria-label='Open user menu' className='rounded-full'>
      <Image
        src='/jr.jpg'
        height={34}
        width={34}
        alt=''
        className='rounded-full'
      />
    </button>
  );
}
