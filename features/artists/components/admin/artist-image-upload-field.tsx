// components/admin/artist-image-upload-field.tsx
'use client';

import { useState } from 'react';
import { IconPhoto, IconLoader2, IconX } from '@tabler/icons-react';
import Image from 'next/image';

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export function ArtistImageUploadField({ value, onChange }: Props) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');

  async function handleFile(file: File) {
    setStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const json = await res.json();

      if (!res.ok) {
        console.error('Cloudinary error:', json);
        throw new Error(json.error?.message ?? 'Upload failed');
      }

      onChange(json.secure_url);
      setStatus('idle');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium'>Artist image</label>

      <div className='flex items-center gap-4'>
        <div className='relative flex h-40 w-40 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700'>
          {value ? (
            <>
              <Image
                src={value.includes('http') ? value : '/albums.jpg'}
                alt='Artist image preview'
                fill
                className='rounded-lg object-cover'
              />
              <button
                type='button'
                onClick={() => onChange(null)}
                className='absolute -right-2 -top-2 rounded-full bg-gray-900 p-1 text-white'
                aria-label='Remove artist image'
              >
                <IconX size={14} />
              </button>
            </>
          ) : status === 'uploading' ? (
            <IconLoader2 className='animate-spin text-gray-400' size={24} />
          ) : (
            <IconPhoto size={24} className='text-gray-400' />
          )}
        </div>

        <label
          className={`flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 ${
            status === 'uploading' ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          {status === 'uploading' && (
            <IconLoader2 size={14} className='animate-spin' />
          )}
          {value ? 'Change image' : 'Upload image'}
          <input
            type='file'
            accept='image/*'
            className='sr-only'
            onChange={e => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file) handleFile(file);
            }}
          />
        </label>
      </div>

      {status === 'error' && (
        <p className='text-xs text-red-600'>Upload failed. Try again.</p>
      )}
    </div>
  );
}
