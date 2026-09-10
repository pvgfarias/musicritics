'use server';

import { siteSearch } from './queries';

export async function siteSearchAction(query: string) {
  return siteSearch(query);
}
