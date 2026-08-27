// components/admin/album-cover-upload-field.tsx
'use client';

import { useState, useRef } from 'react';
import { IconPhoto, IconLoader2, IconX } from '@tabler/icons-react';
import Image from 'next/image';

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export function AlbumCoverUploadField({ value, onChange }: Props) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
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
        {
          method: 'POST',
          body: formData,
        }
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
      <label className='text-sm font-medium'>Cover image</label>

      <div className='relative flex h-40 w-40 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700'>
        {value ? (
          <>
            <Image
              src={value}
              alt='Cover preview'
              fill
              className='rounded-lg object-cover'
            />
            <button
              type='button'
              onClick={() => onChange(null)}
              className='absolute -right-2 -top-2 rounded-full bg-gray-900 p-1 text-white'
              aria-label='Remove cover image'
            >
              <IconX size={14} />
            </button>
          </>
        ) : status === 'uploading' ? (
          <IconLoader2 className='animate-spin text-gray-400' size={24} />
        ) : (
          <button
            type='button'
            onClick={() => inputRef.current?.click()}
            className='flex flex-col items-center gap-1 text-gray-400'
          >
            <IconPhoto size={24} />
            <span className='text-xs'>Upload</span>
          </button>
        )}
      </div>

      {status === 'error' && (
        <p className='text-xs text-red-600'>Upload failed. Try again.</p>
      )}

      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
