import Sidebar from '@/components/layout/sidebar/sidebar';
import Navbar from '@/components/layout/navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-dvh overflow-hidden'>
      <Sidebar />
      <div className='flex flex-col flex-1 min-w-0 h-dvh'>
        <Navbar />
        <main className='relative flex-1 overflow-y-auto bg-background'>
          {children}
        </main>
      </div>
    </div>
  );
}
