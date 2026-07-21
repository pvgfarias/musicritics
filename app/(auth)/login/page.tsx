'use client';

import { motion } from 'motion/react';

export default function Login() {
  return (
    <section className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center text-white bg-amber-50 dark:bg-slate-950'>
      <motion.form
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        // onSubmit={handleSubmit}
        className='space-y-6'
      >
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            // value={formData.name}
            // onChange={handleChange}
            required
            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white'
          />
        </div>
        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
          >
            Password
          </label>
          <input
            type='password'
            id='name'
            name='name'
            placeholder='******'
            // value={formData.name}
            // onChange={handleChange}
            required
            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white'
          />
        </div>
      </motion.form>
    </section>
  );
}
