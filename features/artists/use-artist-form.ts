import { useState } from 'react';
import { CreateArtistInput, createArtistSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

type GenreOption = { id: string; name: string; slug: string };

export function useArtistForm(
  defaultValues: CreateArtistInput,
  defaultGenres: GenreOption[] = []
) {
  const [slugTouched, setSlugTouched] = useState(false);
  const [genres, setGenres] = useState<GenreOption[]>(defaultGenres);

  const form = useForm<CreateArtistInput>({
    resolver: zodResolver(createArtistSchema),
    defaultValues,
  });

  // Same keyName override as useAlbumForm — avoids useFieldArray's default
  // 'id' key colliding with any real 'id' field on array items. Not
  // strictly needed here yet (StreamingLink rows have no client-side id to
  // preserve the way tracks do), but kept consistent with the album form
  // in case that changes.
  const streamingLinks = useFieldArray({
    control: form.control,
    name: 'streamingLinks',
    keyName: '_fieldKey',
  });

  function handleNameChange(value: string) {
    form.setValue('name', value);
    if (!slugTouched) form.setValue('slug', slugify(value));
  }

  function handleImageChange(image: string | null) {
    form.setValue('image', image);
  }

  function handleBioChange(bio: string) {
    form.setValue('bio', bio.trim().length ? bio : null);
  }

  function handleGenresChange(next: GenreOption[]) {
    setGenres(next);
    form.setValue(
      'genreIds',
      next.map(g => g.id)
    );
  }

  function handleCountryChange(value: string) {
    const trimmed = value.trim().toUpperCase();
    form.setValue('country', trimmed.length ? trimmed : null);
  }

  function handleDebutDateChange(value: string | Date | null) {
    if (value === null || value instanceof Date) {
      form.setValue('debutDate', value);
      return;
    }
    const parsed = new Date(value);
    form.setValue('debutDate', isNaN(parsed.getTime()) ? null : parsed);
  }

  function handleDisbandedDateChange(value: string | Date | null) {
    if (value === null || value instanceof Date) {
      form.setValue('disbandedDate', value);
      return;
    }
    const parsed = new Date(value);
    form.setValue('disbandedDate', isNaN(parsed.getTime()) ? null : parsed);
  }

  return {
    form,
    genres,
    streamingLinks,
    slugTouched,
    setSlugTouched,
    handleNameChange,
    handleImageChange,
    handleBioChange,
    handleGenresChange,
    handleCountryChange,
    handleDebutDateChange,
    handleDisbandedDateChange,
  };
}

export type ArtistFormState = ReturnType<typeof useArtistForm>;
