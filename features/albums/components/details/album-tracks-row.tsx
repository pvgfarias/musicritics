'use client';

import { useState } from 'react';
import Image from 'next/image';
import RatingScore from '@/components/dashboard/rating-score';
import { AlbumTrackForRating } from '@/features/ratings/queries';
import { AlbumTrack } from '@/features/albums/queries';
import { ALBUM_TRACK_GRID } from './album-tracks';

export default function AlbumTracksRow({
  track,
  userTrackRating,
  ratingsArePublic,
  userId,
}: {
  track: AlbumTrack;
  userTrackRating: AlbumTrackForRating | undefined;
  ratingsArePublic: boolean;
  userId: string | undefined;
}) {
  const [showComments, setShowComments] = useState(false);

  const comments = track.ratings.filter(rating => rating.comment != null);

  const userComment = userTrackRating?.comment || null;

  const otherComments = userId
    ? comments.filter(rating => rating.user.id !== userId)
    : comments;

  const visibleCommentCount = ratingsArePublic
    ? comments.length
    : userComment
      ? 1
      : 0;

  const canToggle = visibleCommentCount > 0;

  return (
    <div
      className={`flex flex-col w-full rounded-md hover:bg-orange-100 dark:hover:bg-slate-900 transition-colors ${
        canToggle ? 'cursor-pointer' : ''
      }`}
    >
      <div
        role={canToggle ? 'button' : undefined}
        tabIndex={canToggle ? 0 : undefined}
        aria-expanded={canToggle ? showComments : undefined}
        onClick={() => canToggle && setShowComments(prev => !prev)}
        onKeyDown={e => {
          if (canToggle && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setShowComments(prev => !prev);
          }
        }}
        className={`${ALBUM_TRACK_GRID} group px-2 py-4`}
      >
        <span className='font-mono text-xs text-gray-600 dark:text-gray-400 group-hover:text-ember'>
          {String(track.number).padStart(2, '0')}
        </span>
        <span className='text-md font-text text-gray-800 dark:text-gray-200'>
          {track.title}
        </span>

        <div className='flex items-center justify-center gap-1.5'>
          <span className='font-mono text-xs text-gray-500'>
            {userTrackRating?.score ? (
              <RatingScore ratingScore={userTrackRating.score} size='sm' />
            ) : (
              '—'
            )}
          </span>
        </div>

        <div className='flex items-center justify-center gap-1.5'>
          <span className='text-gray-600 dark:text-white'>
            {ratingsArePublic && track.averageRating && (
              <RatingScore ratingScore={track.averageRating} size='sm' />
            )}
          </span>
        </div>

        <div className='flex items-center justify-center gap-1.5'>
          <span
            className={`font-mono text-xs ${
              canToggle ? 'text-ember' : 'text-gray-500'
            }`}
          >
            {visibleCommentCount}
          </span>
        </div>

        <div />
      </div>

      {showComments && (
        <div className='flex flex-col gap-3 px-10 pb-4'>
          {userComment && (
            <div className='flex flex-row gap-3'>
              <div className='w-7 h-7 rounded-full bg-gray-300 dark:bg-slate-800 shrink-0' />
              <div className='flex flex-col gap-0.5'>
                <div className='flex flex-row items-center gap-2'>
                  <span className='font-mono text-xs text-gray-800 dark:text-gray-200'>
                    You
                  </span>
                  {userTrackRating?.score != null && (
                    <RatingScore
                      ratingScore={userTrackRating.score}
                      size='sm'
                    />
                  )}
                </div>
                <p className='text-sm font-text text-gray-700 dark:text-gray-300'>
                  {userComment}
                </p>
              </div>
            </div>
          )}

          {ratingsArePublic &&
            otherComments.map(rating => (
              <div key={rating.id} className='flex flex-row gap-3'>
                {rating.comment && rating.comment?.author?.image ? (
                  <Image
                    src={`/${rating.comment!.author.image}`}
                    alt={rating.comment!.author.username ?? ''}
                    width={28}
                    height={28}
                    className='rounded-full h-fit'
                  />
                ) : (
                  <div className='w-7 h-7 rounded-full bg-gray-300 dark:bg-slate-800 shrink-0' />
                )}
                <div className='flex flex-col gap-0.5'>
                  <div className='flex flex-row items-center gap-2'>
                    <span className='font-mono text-xs text-gray-800 dark:text-gray-200'>
                      {rating.comment?.author?.username}
                    </span>
                    {rating.score != null && (
                      <RatingScore ratingScore={rating.score} size='sm' />
                    )}
                  </div>
                  <p className='text-sm font-text text-gray-700 dark:text-gray-300'>
                    {rating.comment!.body}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
