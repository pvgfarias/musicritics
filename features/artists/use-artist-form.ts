'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createArtistSchema,
  type CreateArtistInput,
} from '@/features/artists/schema';

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function useArtistForm(defaultValues: CreateArtistInput) {
  const [slugTouched, setSlugTouched] = useState(false);

  const form = useForm<CreateArtistInput>({
    resolver: zodResolver(createArtistSchema),
    defaultValues,
  });

  function handleNameChange(value: string) {
    form.setValue('name', value);
    if (!slugTouched) form.setValue('slug', slugify(value));
  }

  function handleImageChange(image: string | null) {
    form.setValue('image', image);
  }

  return {
    form,
    slugTouched,
    setSlugTouched,
    handleNameChange,
    handleImageChange,
  };
}

export type ArtistFormState = ReturnType<typeof useArtistForm>;
