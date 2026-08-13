'use server';

import { getAlbumsPage } from '@/data/albums';

export async function fetchAlbumsPage(page: number, pageSize: number) {
  return getAlbumsPage(page, pageSize);
}
