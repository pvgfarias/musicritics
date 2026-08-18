export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex md:h-screen h-full flex-col md:flex-row bg-background'>
      <div className='w-full md:px-12 py-8'>{children}</div>
    </div>
  );
}
