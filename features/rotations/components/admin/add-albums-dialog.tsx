'use client';

import { useEffect, useState, useTransition } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { IconLoader2, IconSearch } from '@tabler/icons-react';
import { toast } from 'sonner';
import {
  addAlbumsToRotation,
  searchAlbumsForRotationAction,
} from '@/features/rotations/actions';
import type { RotationAlbumSearchResult } from '@/features/rotations/queries';

type Props = {
  rotationId: string | null;
  existingAlbumIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddAlbumsDialog({
  rotationId,
  existingAlbumIds,
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[80vh] max-w-lg overflow-hidden flex flex-col p-4'>
        <DialogHeader>
          <DialogTitle>Add albums to rotation</DialogTitle>
        </DialogHeader>

        {/* key={rotationId} — a fresh mount per rotation, and per open,
            since this only renders while open is true. Query/results/
            selected all start clean without an explicit reset effect. */}
        {open && rotationId && (
          <AddAlbumsForm
            key={rotationId}
            rotationId={rotationId}
            existingAlbumIds={existingAlbumIds}
            onDone={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AddAlbumsForm({
  rotationId,
  existingAlbumIds,
  onDone,
  onCancel,
}: {
  rotationId: string;
  existingAlbumIds: string[];
  onDone: () => void;
  onCancel: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RotationAlbumSearchResult[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  // This effect is fine as-is: the setState call happens inside the
  // setTimeout callback, not synchronously in the effect body — that's
  // exactly the "calling setState in a callback function when external
  // state changes" case the rule is asking for.
  useEffect(() => {
    const timeout = setTimeout(() => {
      searchAlbumsForRotationAction(query).then(setResults);
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit() {
    if (selected.size === 0) return;
    startTransition(async () => {
      const result = await addAlbumsToRotation(
        rotationId,
        Array.from(selected)
      );
      if (result.success) {
        toast.success(
          `Added ${selected.size} album${selected.size === 1 ? '' : 's'}`
        );
        onDone();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <div className='flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5'>
        <IconSearch size={16} className='text-gray-400' />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Search albums…'
          className='flex-1 bg-transparent outline-none text-sm'
          autoFocus
        />
      </div>

      <div className='flex-1 overflow-y-auto flex flex-col gap-1 mt-2'>
        {results.length === 0 ? (
          <p className='text-sm text-gray-500 py-6 text-center'>
            No albums found.
          </p>
        ) : (
          results.map(album => {
            const alreadyIn = existingAlbumIds.includes(album.id);
            const checked = selected.has(album.id);
            return (
              <label
                key={album.id}
                className={`flex items-center gap-3 py-2 px-2 rounded-md ${
                  alreadyIn
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer'
                }`}
              >
                <input
                  type='checkbox'
                  checked={checked || alreadyIn}
                  disabled={alreadyIn}
                  onChange={() => toggle(album.id)}
                />
                <Image
                  src={album.coverImage ?? '/albums.jpg'}
                  alt={album.title}
                  width={36}
                  height={36}
                  className='rounded-md shrink-0'
                />
                <div className='flex flex-col min-w-0'>
                  <span className='text-sm font-medium truncate'>
                    {album.title}
                  </span>
                  <span className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                    {album.artist}
                    {alreadyIn && ' · already in this rotation'}
                  </span>
                </div>
              </label>
            );
          })
        )}
      </div>

      <DialogFooter>
        <button
          type='button'
          onClick={onCancel}
          className='rounded-md px-4 py-2 text-sm'
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending || selected.size === 0}
          className='flex items-center gap-2 rounded-md bg-ember px-4 py-2 text-sm font-medium text-white disabled:opacity-60'
        >
          {isPending && <IconLoader2 size={14} className='animate-spin' />}
          Add {selected.size > 0 ? `(${selected.size})` : ''}
        </button>
      </DialogFooter>
    </>
  );
}
