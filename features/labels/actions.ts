// app/actions/label.ts
'use server';

import { prisma } from '@/lib/prisma';
import { requirePermission } from '../auth/auth-helpers';
import { Prisma } from '@/app/generated/prisma/client';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

type CreateLabelResult =
  | { success: true; label: { id: string; name: string } }
  | { success: false; error: string };

type DeleteLabelResult = { success: true } | { success: false; error: string };

export async function searchLabels(query: string) {
  if (!query.trim()) return [];
  return prisma.label.findMany({
    where: { name: { contains: query, mode: 'insensitive' } },
    select: { id: true, name: true },
    take: 10,
  });
}

// Minimal on purpose — just name (+ auto slug). Called from the inline
// "Create '{query}'" option in LabelPickerField, not a full label form, so
// country/etc. are left null and can be filled in later if you build a
// proper label management page.
//
// NOTE: uses `requirePermission({ label: [...] })` — adjust the resource
// key if your permission config doesn't already have a 'label' resource
// defined (it wasn't referenced anywhere before this).
export async function createLabel(name: string): Promise<CreateLabelResult> {
  const allowed = await requirePermission({ label: ['create'] });
  if (!allowed) throw new Error('Unauthorized');

  const trimmed = name.trim();
  if (!trimmed) {
    return { success: false, error: 'Label name is required' };
  }

  try {
    const label = await prisma.label.create({
      data: { name: trimmed, slug: slugify(trimmed) },
      select: { id: true, name: true },
    });
    return { success: true, label };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      return { success: false, error: 'A label with that name already exists' };
    }
    throw err;
  }
}

// Safe to call even if albums currently reference this label — Album.labelId
// is onDelete: SetNull, so deleting a Label just clears labelId on any
// albums that had it, it doesn't touch the albums themselves.
export async function deleteLabel(labelId: string): Promise<DeleteLabelResult> {
  const allowed = await requirePermission({ label: ['delete'] });
  if (!allowed) throw new Error('Unauthorized');

  const label = await prisma.label.findUnique({
    where: { id: labelId },
    select: { id: true },
  });
  if (!label) {
    return { success: false, error: 'Label not found' };
  }

  await prisma.label.delete({ where: { id: labelId } });
  return { success: true };
}
