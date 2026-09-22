'use client';

import GoogleSignInButton from '@/features/auth/components/google-signin-button';
import { authClient } from '@/features/auth/auth-client';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
    <section className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center'>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className='w-full md:w-1/5 md:min-w-90'
      >
        {/* Branding */}
        <Link href='/' className='inline-flex items-center gap-2 mb-2'>
          <span className='text-2xl font-bold text-amber-500'>MusiCritics</span>
        </Link>
        <h1 className='text-xl font-semibold text-gray-900 dark:text-white mb-1'>
          Welcome back
        </h1>
        <p className='text-sm text-gray-500 dark:text-gray-400 mb-8'>
          Log in to rate albums, track your rotations, and follow artists.
        </p>

        <form onSubmit={handleSubmit} className='space-y-6 text-left'>
          <div>
            <label
              htmlFor='identifier'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
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
              className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white'
            />
          </div>

          <div>
            <div className='flex items-center justify-between mb-2'>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Password
              </label>
              <Link
                href='/forgot-password'
                className='text-sm text-amber-500 hover:text-amber-600 hover:underline'
              >
                Forgot password?
              </Link>
            </div>
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
            <p className='text-sm text-red-500' role='alert'>
              {error}
            </p>
          )}

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full flex items-center justify-center px-6 py-3 bg-linear-to-r from-slate-900 to-amber-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <div className='flex items-center gap-3'>
            <div className='h-px flex-1 bg-gray-300 dark:bg-slate-700' />
            <span className='text-sm text-gray-500 dark:text-gray-400'>or</span>
            <div className='h-px flex-1 bg-gray-300 dark:bg-slate-700' />
          </div>

          <GoogleSignInButton />
        </form>

        <p className='mt-8 text-sm text-gray-500 dark:text-gray-400'>
          Don&apos;t have an account?{' '}
          <Link
            href='/register'
            className='text-amber-500 hover:text-amber-600 font-medium hover:underline'
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
