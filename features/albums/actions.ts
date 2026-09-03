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
    select: { id: true },
  });

  if (!album) {
    return { success: false, error: 'Album not found' };
  }

  // isAlbumOpenForRatings now queries RotationAlbum/Rotation directly
  // (there's no boolean on Album to read anymore).
  if (await isAlbumOpenForRatings(albumId)) {
    return {
      success: false,
      error: 'Remove this album from its active rotation before deleting it.',
    };
  }

  // Note: deleting an album with closed-rotation history cascades its
  // Ratings, RotationAlbum snapshots, and Comments via onDelete: Cascade.
  // That's a deliberate trade-off carried over from before — deletion still
  // erases historical scores, only the *in-progress* case is guarded.
  await prisma.album.delete({ where: { id: albumId } });

  revalidatePath('/dashboard/albums');
  return { success: true };
}

// toggleRotation removed — rotation membership is no longer a per-album
// boolean. Use addAlbumToRotation / removeAlbumFromRotation from
// '@/features/rotations/actions' instead, which operate on a specific
// Rotation and enforce the "can't modify a closed rotation" rule.

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
        artists: { create: data.artistIds.map(artistId => ({ artistId })) },
        genres: { create: data.genreIds.map(genreId => ({ genreId })) },
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
      genres: { include: { genre: true } },
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
      // socialLinks / artist / genre links have no dependent rating data,
      // so wholesale replace-on-save is still fine for these.
      await tx.albumSocialLink.deleteMany({ where: { albumId } });
      await tx.albumArtist.deleteMany({ where: { albumId } });
      await tx.albumGenre.deleteMany({ where: { albumId } });

      // Tracks are NOT wholesale-replaced anymore. Ratings cascade-delete
      // when their Track is deleted, so blowing away every track on every
      // save (even ones unrelated to the tracklist, like a cover image
      // change) was silently wiping every track rating in the app.
      //
      // Instead we diff by track id:
      //   - existing track present in the submitted data -> update in place
      //   - existing track missing from submitted data    -> delete (and
      //     yes, that legitimately cascades its ratings — the user removed
      //     the track)
      //   - submitted track with no id                     -> create new
      //
      // This requires `data.tracks[i].id` to be present (optional) on the
      // schema/form for existing rows. If `createAlbumSchema` doesn't carry
      // track id yet, add it there first — otherwise every track will look
      // "new" and this degrades back into delete-all/recreate-all.
      const existingTracks = await tx.track.findMany({
        where: { albumId },
        select: { id: true },
      });
      const existingIds = new Set(existingTracks.map(t => t.id));

      const submittedWithId = data.tracks.filter(
        (t): t is typeof t & { id: string } =>
          Boolean((t as { id?: string }).id)
      );
      const submittedIds = new Set(submittedWithId.map(t => t.id));

      const idsToDelete = [...existingIds].filter(id => !submittedIds.has(id));
      if (idsToDelete.length > 0) {
        await tx.track.deleteMany({ where: { id: { in: idsToDelete } } });
      }

      for (const t of submittedWithId) {
        if (!existingIds.has(t.id)) continue; // stale/foreign id, ignore
        await tx.track.update({
          where: { id: t.id },
          data: { title: t.title, number: t.number },
        });
      }

      const tracksToCreate = data.tracks.filter(
        t => !(t as { id?: string }).id
      );
      if (tracksToCreate.length > 0) {
        await tx.track.createMany({
          data: tracksToCreate.map(t => ({
            albumId,
            title: t.title,
            number: t.number,
          })),
        });
      }

      return tx.album.update({
        where: { id: albumId },
        data: {
          title: data.title,
          slug: data.slug,
          coverImage: data.coverImage,
          releaseDate: data.releaseDate,
          artists: { create: data.artistIds.map(artistId => ({ artistId })) },
          genres: { create: data.genreIds.map(genreId => ({ genreId })) },
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
