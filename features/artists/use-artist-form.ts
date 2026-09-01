import { useState } from 'react';
import { CreateArtistInput, createArtistSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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

  function handleBioChange(bio: string) {
    form.setValue('bio', bio.trim().length ? bio : null);
  }

  function handleGenreChange(genre: string | null) {
    form.setValue('genre', genre);
  }

  function handleDebutDateChange(value: string | Date | null) {
    if (value === null || value instanceof Date) {
      form.setValue('debutDate', value);
      return;
    }
    const parsed = new Date(value);
    form.setValue('debutDate', isNaN(parsed.getTime()) ? null : parsed);
  }

  return {
    form,
    slugTouched,
    setSlugTouched,
    handleNameChange,
    handleImageChange,
    handleBioChange,
    handleGenreChange,
    handleDebutDateChange,
  };
}

export type ArtistFormState = ReturnType<typeof useArtistForm>;
