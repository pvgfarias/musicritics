import { redirect } from 'next/navigation';
import { auth } from '@/features/auth/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import SettingsView from '@/features/users/components/settings-view';

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  // Google-only sign-ins have no 'credential' row (no password to change).
  const credentialAccount = await prisma.account.findFirst({
    where: { userId: session.user.id, providerId: 'credential' },
    select: { id: true },
  });

  return (
    <main className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
      <h1 className='text-3xl font-title text-gray-900 dark:text-white underline decoration-3 decoration-ember underline-offset-8 mb-6'>
        Settings
      </h1>

      <SettingsView
        currentEmail={session.user.email}
        hasPassword={!!credentialAccount}
      />
    </main>
  );
}
