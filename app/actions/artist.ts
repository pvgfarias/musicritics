// app/actions/artist.ts
'use server';

import {
  CreateArtistInput,
  createArtistSchema,
} from '@/lib/artist-form-schema';
import { requirePermission } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma } from '../generated/prisma/client';

type CreateArtistResult =
  | { success: true; artistId: string }
  | { success: false; error: string; field?: string };

type UpdateArtistResult =
  | { success: true; artistId: string }
  | { success: false; error: string; field?: string };

type DeleteArtistResult = { success: true } | { success: false; error: string };

export async function searchArtists(query: string) {
  if (!query.trim()) return [];
  return prisma.artist.findMany({
    where: { name: { contains: query, mode: 'insensitive' } },
    select: { id: true, name: true, image: true },
    take: 10,
  });
}

export async function getArtistForEdit(artistId: string) {
  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
    select: { id: true, name: true, slug: true, image: true },
  });

  if (!artist) throw new Error('Artist not found');

  return artist;
}

export async function createArtist(
  input: CreateArtistInput
): Promise<CreateArtistResult> {
  const allowed = await requirePermission({ artist: ['create'] });
  if (!allowed) throw new Error('Unauthorized');

  const parsed = createArtistSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      success: false,
      error: first.message,
      field: first.path.join('.'),
    };
  }
  const data = parsed.data;

  try {
    const artist = await prisma.artist.create({
      data: {
        name: data.name,
        slug: data.slug,
        image: data.image,
      },
      select: { id: true },
    });

    revalidatePath('/dashboard/artists');
    return { success: true, artistId: artist.id };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      return { success: false, error: 'Slug already in use', field: 'slug' };
    }
    throw err;
  }
}

export async function updateArtist(
  artistId: string,
  input: CreateArtistInput
): Promise<UpdateArtistResult> {
  const allowed = await requirePermission({ artist: ['update'] });
  if (!allowed) throw new Error('Unauthorized');

  const parsed = createArtistSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      success: false,
      error: first.message,
      field: first.path.join('.'),
    };
  }
  const data = parsed.data;

  try {
    const artist = await prisma.artist.update({
      where: { id: artistId },
      data: {
        name: data.name,
        slug: data.slug,
        image: data.image,
      },
      select: { id: true },
    });

    revalidatePath('/dashboard/artists');
    return { success: true, artistId: artist.id };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      return { success: false, error: 'Slug already in use', field: 'slug' };
    }
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      return { success: false, error: 'Artist not found' };
    }
    throw err;
  }
}

export async function deleteArtist(
  artistId: string
): Promise<DeleteArtistResult & { deletedAlbumCount?: number }> {
  const allowed = await requirePermission({ artist: ['delete'] });
  if (!allowed) throw new Error('Unauthorized');

  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
    select: { id: true },
  });

  if (!artist) {
    return { success: false, error: 'Artist not found' };
  }

  const deletedAlbumCount = await prisma.$transaction(async tx => {
    // Albums where this artist is the *only* credited artist would be
    // left with no artists once the join row cascades away — delete
    // those outright instead. Collaborative albums are untouched here;
    // they just lose this artist's credit when the artist row is deleted.
    const soloAlbums = await tx.album.findMany({
      where: {
        artists: {
          some: { artistId },
          every: { artistId },
        },
      },
      select: { id: true },
    });

    if (soloAlbums.length > 0) {
      await tx.album.deleteMany({
        where: { id: { in: soloAlbums.map(a => a.id) } },
      });
    }

    // Cascades the remaining AlbumArtist rows (collaborative albums),
    // removing this artist from their credits without deleting them.
    await tx.artist.delete({ where: { id: artistId } });

    return soloAlbums.length;
  });

  revalidatePath('/dashboard/artists');
  revalidatePath('/dashboard/albums');
  return { success: true, deletedAlbumCount };
}
