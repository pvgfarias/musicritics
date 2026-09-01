// lib/use-album-form.ts
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createAlbumSchema,
  type CreateAlbumInput,
} from '@/features/albums/schema';

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

type ArtistOption = { id: string; name: string; image: string | null };

export function useAlbumForm(
  defaultValues: CreateAlbumInput,
  defaultArtists: ArtistOption[] = []
) {
  const [artists, setArtists] = useState<ArtistOption[]>(defaultArtists);
  const [slugTouched, setSlugTouched] = useState(false);

  const form = useForm<CreateAlbumInput>({
    resolver: zodResolver(createAlbumSchema),
    defaultValues,
  });

  const tracks = useFieldArray({ control: form.control, name: 'tracks' });
  const socialLinks = useFieldArray({
    control: form.control,
    name: 'socialLinks',
  });

  function handleTitleChange(value: string) {
    form.setValue('title', value);
    if (!slugTouched) form.setValue('slug', slugify(value));
  }

  function handleArtistsChange(next: ArtistOption[]) {
    setArtists(next);
    form.setValue(
      'artistIds',
      next.map(a => a.id)
    );
  }

  return {
    form,
    tracks,
    socialLinks,
    artists,
    slugTouched,
    setSlugTouched,
    handleTitleChange,
    handleArtistsChange,
  };
}

export type AlbumFormState = ReturnType<typeof useAlbumForm>;
