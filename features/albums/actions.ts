// actions/album.ts
'use server';

import { requirePermission } from '../auth/auth-helpers';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { isAlbumOpenForRatings } from '@/features/albums/queries';
import { Prisma } from '../../app/generated/prisma/client';
import {
  createAlbumSchema,
  type CreateAlbumInput,
} from '@/features/albums/schema';

type CreateAlbumResult =
  | { success: true; albumId: string }
  | { success: false; error: string; field?: string };

type ActionResult = { success: true } | { success: false; error: string };

export async function deleteAlbum(albumId: string): Promise<ActionResult> {
  const allowed = await requirePermission({ album: ['delete'] });
  if (!allowed) throw new Error('Unauthorized');

  const album = await prisma.album.findUnique({
    where: { id: albumId },
    select: { id: true, finalized: true },
  });

  if (!album) {
    return { success: false, error: 'Album not found' };
  }

  if (isAlbumOpenForRatings(album)) {
    return {
      success: false,
      error: 'Remove this album from rotation before deleting it.',
    };
  }

  await prisma.album.delete({ where: { id: albumId } });

  revalidatePath('/dashboard/albums');
  return { success: true };
}

export async function toggleRotation(
  albumId: string,
  openForRatings: boolean
): Promise<ActionResult> {
  const allowed = await requirePermission({ album: ['update'] });
  if (!allowed) throw new Error('Unauthorized');

  const album = await prisma.album.findUnique({
    where: { id: albumId },
    select: { id: true },
  });

  if (!album) {
    return { success: false, error: 'Album not found' };
  }

  await prisma.album.update({
    where: { id: albumId },
    data: { finalized: !openForRatings },
  });

  revalidatePath('/dashboard/albums');
  return { success: true };
}

export async function createAlbum(
  input: CreateAlbumInput
): Promise<CreateAlbumResult> {
  const allowed = await requirePermission({ album: ['create'] });
  if (!allowed) throw new Error('Unauthorized');

  const parsed = createAlbumSchema.safeParse(input);
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
    const album = await prisma.album.create({
      data: {
        title: data.title,
        slug: data.slug,
        coverImage: data.coverImage,
        releaseDate: data.releaseDate,
        genre: data.genre,
        artists: { create: data.artistIds.map(artistId => ({ artistId })) },
        tracks: {
          create: data.tracks.map(t => ({ title: t.title, number: t.number })),
        },
        socialLinks: { create: data.socialLinks },
      },
      select: { id: true },
    });

    revalidatePath('/dashboard/albums');
    return { success: true, albumId: album.id };
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

export async function getAlbumForEdit(albumId: string) {
  const allowed = await requirePermission({ album: ['update'] });
  if (!allowed) throw new Error('Unauthorized');

  return prisma.album.findUniqueOrThrow({
    where: { id: albumId },
    include: {
      tracks: { orderBy: { number: 'asc' } },
      socialLinks: true,
      artists: { include: { artist: true } },
    },
  });
}

export async function updateAlbum(
  albumId: string,
  input: CreateAlbumInput
): Promise<CreateAlbumResult> {
  const allowed = await requirePermission({ album: ['update'] });
  if (!allowed) throw new Error('Unauthorized');

  const parsed = createAlbumSchema.safeParse(input);
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
    const album = await prisma.$transaction(async tx => {
      // Relations (tracks, socialLinks, artist links) need to be replaced
      // wholesale since the form doesn't track per-row IDs for diffing.
      await tx.track.deleteMany({ where: { albumId } });
      await tx.albumSocialLink.deleteMany({ where: { albumId } });
      await tx.albumArtist.deleteMany({ where: { albumId } });

      return tx.album.update({
        where: { id: albumId },
        data: {
          title: data.title,
          slug: data.slug,
          coverImage: data.coverImage,
          releaseDate: data.releaseDate,
          genre: data.genre,
          artists: { create: data.artistIds.map(artistId => ({ artistId })) },
          tracks: {
            create: data.tracks.map(t => ({
              title: t.title,
              number: t.number,
            })),
          },
          socialLinks: { create: data.socialLinks },
        },
        select: { id: true },
      });
    });

    revalidatePath('/dashboard/albums');
    return { success: true, albumId: album.id };
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
