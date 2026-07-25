import Sidebar from '@/components/dashboard/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex md:h-screen md:overflow-y-hidden h-full flex-col md:flex-row bg-mist-200'>
      <div className='w-full flex-none md:w-64'>
        <Sidebar />
      </div>
      <div className='md:px-12 w-full'>
        <div className='py-8 text-gray-900 dark:text-white'>{children}</div>
      </div>
    </div>
  );
}
