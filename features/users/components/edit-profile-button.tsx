'use client';

import { useState } from 'react';
import { IconPencil } from '@tabler/icons-react';
import { EditProfileDialog } from './edit-profile-dialog';

type FavoriteAlbum = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
};

export function EditProfileButton({
  initial,
  initialFavorites,
}: {
  initial: {
    displayUsername: string;
    image: string | null;
    bio: string | null;
    country: string | null;
  };
  initialFavorites: FavoriteAlbum[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='flex items-center gap-1.5 rounded-md border border-gray-300 dark:border-slate-800 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-900'
      >
        <IconPencil size={14} />
        Edit profile
      </button>

      <EditProfileDialog
        open={open}
        onOpenChange={setOpen}
        initial={initial}
        initialFavorites={initialFavorites}
      />
    </>
  );
}
