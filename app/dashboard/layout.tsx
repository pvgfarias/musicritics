import Sidebar from '@/components/dashboard/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen flex-col md:flex-row md:overflow-hidden'>
      <div className='w-full flex-none md:w-64'>
        <Sidebar />
      </div>
      <div className='grow md:p-12'>{children}</div>
    </div>
  );
}
