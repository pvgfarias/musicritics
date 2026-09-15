'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { IconLoader2 } from '@tabler/icons-react';
import { authClient } from '@/features/auth/auth-client';

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className='flex flex-col gap-3 rounded-md border border-gray-200 dark:border-slate-800 p-4'>
      <div>
        <h2 className='text-lg font-title text-gray-900 dark:text-white'>
          {title}
        </h2>
        {description && (
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function EmailSection({ currentEmail }: { currentEmail: string }) {
  const [newEmail, setNewEmail] = useState('');
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail || newEmail === currentEmail) return;

    setIsPending(true);
    const { error } = await authClient.changeEmail({
      newEmail,
      callbackURL: '/settings',
    });
    setIsPending(false);

    if (error) {
      toast.error(error.message ?? 'Failed to start email change.');
      return;
    }

    toast.success(
      `Verification link sent to ${newEmail}. Your email won't change until you click it.`
    );
    setNewEmail('');
  }

  return (
    <SectionCard
      title='Email'
      description={`Currently ${currentEmail}. Changing it requires verifying the new address before it takes effect.`}
    >
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <input
          type='email'
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          placeholder='New email address'
          className='rounded-md border border-gray-300 dark:border-gray-700 bg-transparent p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember'
        />
        <button
          type='submit'
          disabled={isPending || !newEmail || newEmail === currentEmail}
          className='self-start flex items-center gap-2 rounded-md bg-ember px-4 py-2 text-sm font-medium text-white hover:bg-ember/90 disabled:opacity-60'
        >
          {isPending && <IconLoader2 size={14} className='animate-spin' />}
          Change email
        </button>
      </form>
    </SectionCard>
  );
}

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match.");
      return;
    }

    setIsPending(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setIsPending(false);

    if (error) {
      toast.error(error.message ?? 'Failed to change password.');
      return;
    }

    toast.success('Password changed. Other sessions were signed out.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <SectionCard
      title='Password'
      description='Changing your password signs you out everywhere else.'
    >
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <input
          type='password'
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          placeholder='Current password'
          autoComplete='current-password'
          className='rounded-md border border-gray-300 dark:border-gray-700 bg-transparent p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember'
        />
        <input
          type='password'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder='New password'
          autoComplete='new-password'
          className='rounded-md border border-gray-300 dark:border-gray-700 bg-transparent p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember'
        />
        <input
          type='password'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder='Confirm new password'
          autoComplete='new-password'
          className='rounded-md border border-gray-300 dark:border-gray-700 bg-transparent p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember'
        />
        <button
          type='submit'
          disabled={isPending || !currentPassword || !newPassword}
          className='self-start flex items-center gap-2 rounded-md bg-ember px-4 py-2 text-sm font-medium text-white hover:bg-ember/90 disabled:opacity-60'
        >
          {isPending && <IconLoader2 size={14} className='animate-spin' />}
          Change password
        </button>
      </form>
    </SectionCard>
  );
}

export default function SettingsView({
  currentEmail,
  hasPassword,
}: {
  currentEmail: string;
  hasPassword: boolean;
}) {
  return (
    <div className='flex flex-col gap-6'>
      <EmailSection currentEmail={currentEmail} />

      {hasPassword ? (
        <PasswordSection />
      ) : (
        <SectionCard title='Password'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            You signed in with Google, so there&apos;s no password on this
            account to change.
          </p>
        </SectionCard>
      )}
    </div>
  );
}
