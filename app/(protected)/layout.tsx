import { auth } from '@/features/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  return (
    <div className='flex md:h-screen h-full flex-col md:flex-row bg-background'>
      <div className='w-full md:px-12 py-8'>{children}</div>
    </div>
  );
}
