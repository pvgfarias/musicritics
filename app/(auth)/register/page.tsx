'use client';

import GoogleSignInButton from '@/components/auth/google-signin-button';
import { authClient } from '@/lib/auth-client';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    const { error } = await authClient.signUp.email({
      email,
      password,
      username,
      name: username,
    });

    setIsSubmitting(false);

    if (error) {
      setError(error.message ?? 'Something went wrong. Please try again.');
      return;
    }

    router.push('/login?verify=1');
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
            htmlFor='username'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left'
          >
            Email or Username
          </label>
          <input
            type='text'
            id='username'
            name='username'
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder='yourname'
            required
            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white '
          />
        </div>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='email@email.com'
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
            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white'
          />
        </div>
        <div>
          <label
            htmlFor='confirmPassword'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left'
          >
            Confirm Password
          </label>
          <input
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            placeholder='**********'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
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
          {isSubmitting ? 'Creating account...' : 'Register'}
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
