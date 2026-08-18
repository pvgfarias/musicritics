'use client';

import GoogleSignInButton from '@/components/auth/google-signin-button';
import { authClient } from '@/lib/auth-client';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const isEmail = identifier.includes('@');

    const { error } = isEmail
      ? await authClient.signIn.email({
          email: identifier,
          password,
        })
      : await authClient.signIn.username({
          username: identifier,
          password,
        });

    setIsSubmitting(false);

    if (error) {
      setError(error.message ?? 'Invalid email or password.');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <section className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center text-white bg-amber-50 dark:bg-slate-950'>
      <motion.form
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        onSubmit={handleSubmit}
        className='space-y-6 md:w-1/5'
      >
        <div>
          <label
            htmlFor='identifier'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left'
          >
            Email or Username
          </label>
          <input
            type='text'
            id='identifier'
            name='identifier'
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder='email@email.com or username'
            autoComplete='username'
            required
            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white '
          />
        </div>
        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left'
          >
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            placeholder='**********'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete='current-password'
            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white'
          />
        </div>
        {error && (
          <p className='text-sm text-red-500 text-left' role='alert'>
            {error}
          </p>
        )}
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full flex items-center justify-center px-6 py-3 bg-linear-to-r from-dark-blue to-amber-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        <div className='flex items-center gap-3'>
          <div className='h-px flex-1 bg-gray-300 dark:bg-slate-700' />
          <span className='text-sm text-gray-500 dark:text-gray-400'>or</span>
          <div className='h-px flex-1 bg-gray-300 dark:bg-slate-700' />
        </div>
        <GoogleSignInButton />
      </motion.form>
    </section>
  );
}
