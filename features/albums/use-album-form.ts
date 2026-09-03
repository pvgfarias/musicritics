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

  // keyName is changed from the default 'id' to '_fieldKey'. useFieldArray
  // otherwise injects its own generated id onto every array item using the
  // property name 'id' for React keying — which collides with and silently
  // overwrites our track schema's real 'id' (the DB track id) the moment
  // the field array initializes from defaultValues. That overwritten value
  // then goes straight into the submitted form data, so updateAlbum can
  // never match tracks by id, and every track looks "new" on save.
  const tracks = useFieldArray({
    control: form.control,
    name: 'tracks',
    keyName: '_fieldKey',
  });
  const socialLinks = useFieldArray({
    control: form.control,
    name: 'socialLinks',
    keyName: '_fieldKey',
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
