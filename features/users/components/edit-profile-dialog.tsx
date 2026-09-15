'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { IconLoader2 } from '@tabler/icons-react';
import { authClient } from '@/features/auth/auth-client';
import { updateProfile } from '@/features/users/actions';
import { AvatarUploadField } from './avatar-upload-field';
import { CountryPickerField } from '@/components/ui/country-picker-field';
import { FavoriteAlbumsEditor } from './favorite-albums-editor';

type FavoriteAlbum = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
};

type EditProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: {
    displayUsername: string;
    image: string | null;
    bio: string | null;
    country: string | null;
  };
  initialFavorites: FavoriteAlbum[];
};

export function EditProfileDialog({
  open,
  onOpenChange,
  initial,
  initialFavorites,
}: EditProfileDialogProps) {
  const router = useRouter();
  const [displayUsername, setDisplayUsername] = useState(
    initial.displayUsername
  );
  const [image, setImage] = useState(initial.image);
  const [bio, setBio] = useState(initial.bio ?? '');
  const [country, setCountry] = useState(initial.country);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      // Two separate writes: better-auth owns displayUsername/image, plain
      // Prisma owns bio/country (see updateProfile's comment for why).
      // Favorites already save themselves immediately as you add/remove
      // them in FavoriteAlbumsEditor, not on this Save button.
      const { error: authError } = await authClient.updateUser({
        displayUsername,
        image,
      });
      if (authError) {
        toast.error(authError.message ?? 'Failed to update profile.');
        return;
      }

      const result = await updateProfile({ bio, country });
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success('Profile updated');
      router.refresh();
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-slate-800 dark:text-white max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4'>
          <AvatarUploadField value={image} onChange={setImage} />

          <label className='flex flex-col gap-1 text-sm'>
            Display name
            <input
              value={displayUsername}
              onChange={e => setDisplayUsername(e.target.value)}
              className='rounded-md border border-gray-700 bg-transparent p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember'
            />
          </label>

          <label className='flex flex-col gap-1 text-sm'>
            Bio
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              maxLength={500}
              className='rounded-md border border-gray-700 bg-transparent p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ember'
              placeholder='Tell people a bit about yourself…'
            />
          </label>

          <div className='flex flex-col gap-1 text-sm'>
            Country
            <CountryPickerField value={country} onChange={setCountry} />
          </div>

          <FavoriteAlbumsEditor initialFavorites={initialFavorites} />
        </div>

        <DialogFooter>
          <button
            type='button'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className='rounded-md px-4 py-2 text-sm'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleSave}
            disabled={isPending}
            className='flex items-center gap-2 rounded-md bg-ember px-4 py-2 text-sm font-medium text-white hover:bg-ember/90 disabled:opacity-60'
          >
            {isPending && <IconLoader2 size={14} className='animate-spin' />}
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
