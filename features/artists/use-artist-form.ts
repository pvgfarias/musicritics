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
    genres,
    slugTouched,
    setSlugTouched,
    handleNameChange,
    handleImageChange,
    handleBioChange,
    handleGenresChange,
    handleDebutDateChange,
  };
}

export type ArtistFormState = ReturnType<typeof useArtistForm>;
