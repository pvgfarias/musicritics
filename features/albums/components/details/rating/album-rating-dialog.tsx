'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import type { AlbumFull } from '@/features/albums/queries';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import { useMemo, useState, useTransition } from 'react';
import { saveAlbumRating } from '@/features/ratings/actions';
import TrackRatingRow from './album-track-rating-row';
import { AlbumTrackForRating } from '@/features/tracks/queries';
import Image from 'next/image';
import RatingScore from '@/components/dashboard/rating-score';

// One entry from album.ratings — the current user's rating, if it exists.
type AlbumUserRating = Exclude<AlbumFull, null>['ratings'][number];

export default function AlbumRatingDialog({
  album,
  userRating,
  tracks,
}: {
  album: Exclude<AlbumFull, null>;
  userRating: AlbumUserRating | undefined;
  tracks: AlbumTrackForRating[];
}) {
  const [scores, setScores] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(tracks.map(t => [t.id, t.score]))
  );

  const [trackComments, setTrackComments] = useState<Record<string, string>>(
    () => Object.fromEntries(tracks.map(t => [t.id, t.comment ?? '']))
  );

  const averageScore = useMemo(() => {
    const rated = Object.values(scores).filter((s): s is number => s !== null);
    if (!rated.length) return null;
    return Math.round(rated.reduce((a, b) => a + b, 0) / rated.length);
  }, [scores]);

  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState(userRating?.comment?.body || '');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleScoreChange = (trackId: string, score: number) => {
    setScores(prev => ({ ...prev, [trackId]: score }));
  };

  const handleTrackCommentChange = (trackId: string, trackComment: string) => {
    setTrackComments(prev => ({ ...prev, [trackId]: trackComment }));
  };

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        await saveAlbumRating({
          albumId: album.id,
          albumSlug: album.slug,
          albumComment: comment,
          trackRatings: tracks.map(t => ({
            trackId: t.id,
            score: scores[t.id],
            comment: trackComments[t.id] ?? '',
          })),
        });
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      }
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className='group w-32 flex flex-row justify-center items-center gap-1.5 text-sm font-medium text-ember border border-ember/30 hover:bg-ember hover:text-white transition-colors duration-200 rounded-full px-3 py-1'>
          {!userRating?.score ? (
            <>
              <IconStar size={16} className='group-hover:hidden' />
              <IconStarFilled size={16} className='hidden group-hover:block' />
              Rate Now
            </>
          ) : (
            <>
              <IconStar size={16} className='group-hover:hidden' />
              <IconStarFilled size={16} className='hidden group-hover:block' />
              {userRating.score}&nbsp;&nbsp;·&nbsp;&nbsp;Edit
            </>
          )}
        </div>
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <DialogHeader className='flex flex-col gap-1 px-4 pt-4'>
          <div className='flex flex-row gap-2'>
            <Image
              src={
                album.coverImage?.includes('http')
                  ? `${album.coverImage}`
                  : `/${album.coverImage}`
              }
              alt={`${album.title} cover`}
              width={75}
              height={75}
              className='rounded-md'
            />
            <div className='flex flex-col grow'>
              <DialogTitle className='text-lg font-title text-gray-950 dark:text-white'>
                {album.title}
              </DialogTitle>
              <span className='text-md  text-gray-800 dark:text-gray-200'>
                {album.artist}&nbsp;·&nbsp;{album.releaseDate?.getFullYear()}
              </span>
            </div>
            <div className='flex flex-col gap-1 items-center'>
              <p className='font-mono text-xs text-gray-600 dark:text-gray-500 uppercase tracking-widest'>
                OVERALL
              </p>
              <RatingScore
                ratingScore={averageScore ?? 0}
                inAlbum={false}
                size='lg'
              />
            </div>
          </div>
        </DialogHeader>
        <div className='h-px bg-gray-300 dark:bg-slate-800' />

        <div className='max-h-[60vh] overflow-y-auto flex flex-col gap-6 px-4'>
          {tracks.map(track => (
            <TrackRatingRow
              key={track.id}
              track={track}
              score={scores[track.id]}
              comment={trackComments[track.id]}
              onScoreChange={score => handleScoreChange(track.id, score)}
              onCommentChange={comment =>
                handleTrackCommentChange(track.id, comment)
              }
            />
          ))}
        </div>

        <div className='h-px bg-gray-300 dark:bg-slate-800' />

        <div className='flex flex-col pb-4 px-4 gap-4'>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder='Add a review about this album…'
            className='text-sm bg-transparent border border-gray-700 rounded-md p-2 resize-none focus:border-ember outline-none'
            rows={3}
          />
          {error && <p className='text-sm text-red-400'>{error}</p>}
          <div className='flex justify-end gap-2'>
            <DialogClose>
              <span className='text-sm text-gray-400 px-3 py-1.5 rounded-full hover:text-gray-200'>
                Cancel
              </span>
            </DialogClose>
            <button
              onClick={handleSave}
              disabled={isPending}
              className='text-sm px-4 py-1.5 rounded-full bg-ember text-white font-medium disabled:opacity-50'
            >
              {isPending ? 'Saving…' : 'Save Rating'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
