'use client';

import { motion } from 'motion/react';

export default function Login() {
  return (
    <section className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center text-white bg-amber-50 dark:bg-slate-950'>
      <motion.form
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        // onSubmit={handleSubmit}
        className='space-y-6 md:w-1/5'
      >
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
            // value={formData.name}
            // onChange={handleChange}
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
            // value={formData.name}
            // onChange={handleChange}
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
            // value={formData.name}
            // onChange={handleChange}
            required
            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white'
          />
        </div>
        <button
          type='submit'
          // disabled={isSubmitting}
          className='w-full flex items-center justify-center px-6 py-3 bg-linear-to-r from-dark-blue to-amber-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Register
        </button>
      </motion.form>
    </section>
  );
}
