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
type GenreOption = { id: string; name: string; slug: string };

export function useAlbumForm(
  defaultValues: CreateAlbumInput,
  defaultArtists: ArtistOption[] = [],
  defaultGenres: GenreOption[] = []
) {
  const [artists, setArtists] = useState<ArtistOption[]>(defaultArtists);
  const [genres, setGenres] = useState<GenreOption[]>(defaultGenres);
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

  function handleGenresChange(next: GenreOption[]) {
    setGenres(next);
    form.setValue(
      'genreIds',
      next.map(g => g.id)
    );
  }

  return {
    form,
    tracks,
    socialLinks,
    artists,
    genres,
    slugTouched,
    setSlugTouched,
    handleTitleChange,
    handleArtistsChange,
    handleGenresChange,
  };
}

export type AlbumFormState = ReturnType<typeof useAlbumForm>;
