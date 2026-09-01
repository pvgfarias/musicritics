// components/admin/album-form.tsx
'use client';

import { useState } from 'react';

type AlbumFormValues = {
  title: string;
};

type AlbumFormProps = {
  defaultValues?: Partial<AlbumFormValues>;
  onSubmit: (values: AlbumFormValues) => Promise<void>;
  submitLabel: string;
};

export function AlbumForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: AlbumFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? '');
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await onSubmit({ title });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder='Album title'
        className='w-full rounded border px-3 py-2'
      />

      <button type='submit' disabled={pending} className='...'>
        {pending ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
