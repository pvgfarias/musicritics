'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import type { AlbumFull } from '@/data/albums';
import { IconBubble, IconStar, IconStarFilled } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import TrackRatingRow from './album-track-rating-row';
import { AlbumTrackForRating } from '@/data/tracks';
import Image from 'next/image';
import RatingGrade from '@/components/dashboard/rating-grade';

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
  // seed straight from each track's existing score — null if never rated
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

  const [comment, setComment] = useState(userRating?.comment?.body || '');
  const [showComment, setShowComment] = useState(false);

  const handleScoreChange = (trackId: string, score: number) => {
    setScores(prev => ({ ...prev, [trackId]: score }));
  };

  const handleTrackCommentChange = (trackId: string, trackComment: string) => {
    setTrackComments(prev => ({ ...prev, [trackId]: trackComment }));
  };

  const handleSaveComment = () => {
    setComment(comment.trim());
    setShowComment(false);
  };
  const handleCancelComment = () => {
    setComment(comment);
    setShowComment(false);
  };

  return (
    <Dialog>
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
              src={album.coverImage ? `/${album.coverImage}` : '/albums.jpg'}
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
              <RatingGrade
                ratingGrade={averageScore ?? 0}
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

        <div className='flex flex-col gap-4 pb-4 px-4'>
          <div className='flex flex-col gap-2 pb-4 pt-3 px-4'>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder='Add a review about this album…'
              className='text-sm bg-transparent border border-gray-700 rounded-md p-2 resize-none focus:border-ember outline-none'
              rows={2}
            />
            <div className='flex justify-end gap-2'>
              <DialogClose>
                <span className='text-sm text-gray-400 px-3 py-1.5 rounded-full hover:text-gray-200'>
                  Cancel
                </span>
              </DialogClose>
              <button className='text-sm px-4 py-1.5 rounded-full bg-ember text-white font-medium'>
                Save Rating
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
