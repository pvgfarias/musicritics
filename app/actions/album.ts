// actions/album.ts
'use server';
import { requirePermission } from '@/lib/auth-helpers';

export async function deleteAlbum(albumId: string) {
  const allowed = await requirePermission({ album: ['delete'] });
  if (!allowed) throw new Error('Unauthorized');

  // proceed with deletion — only admin passes this, moderator won't
}

export async function createAlbum(formData: FormData) {
  const allowed = await requirePermission({ album: ['create'] });
  if (!allowed) throw new Error('Unauthorized');

  // proceed — both admin and moderator pass this
}
