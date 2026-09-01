// components/admin/artist-form.tsx
'use client';

import { useArtistForm } from '@/features/artists/use-artist-form';
import { ArtistFormFields } from './artist-form-fields';
import type { CreateArtistInput } from '@/features/artists/schema';

type ArtistFormProps = {
  defaultValues: CreateArtistInput;
  onSubmit: (values: CreateArtistInput) => Promise<void>;
  submitLabel: string;
};

export function ArtistForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: ArtistFormProps) {
  const artistForm = useArtistForm(defaultValues);
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = artistForm.form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <ArtistFormFields {...artistForm} />

      <button
        type='submit'
        disabled={isSubmitting}
        className='rounded bg-ember px-4 py-2 text-sm font-medium text-white disabled:opacity-60'
      >
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
