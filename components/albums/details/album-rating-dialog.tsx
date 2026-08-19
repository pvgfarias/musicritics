'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import type { AlbumFull } from '@/data/albums';
import { IconRefresh } from '@tabler/icons-react';

export default function AlbumRatingDialog({
  album,
}: {
  album: Exclude<AlbumFull, null>;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <div className='absolute flex justify-center items-center gap-2 bg-ember font-mono text-gray-200 px-2 py-1 text-xs rounded-full bottom-2 right-2'>
          <IconRefresh size={12} /> Weekly Rotation &rarr;
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate {album.title}</DialogTitle>
        </DialogHeader>

        {/* Rating form goes here */}
      </DialogContent>
    </Dialog>
  );
}
