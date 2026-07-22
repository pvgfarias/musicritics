export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className='rounded-xl bg-gray-50 p-2 shadow-sm'>
      <div className='flex p-4'>
        <h3 className='ml-2 text-sm text-amber-600 font-medium'>DASHBOARD</h3>
      </div>
      <div className='rounded-xl bg-white px-4 py-8 text-gray-900 h-200'>
        {children}
      </div>
    </div>
  );
}
