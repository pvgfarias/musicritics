'use client';

import { useState } from 'react';
import Image from 'next/image';
import RatingScore from '@/components/dashboard/rating-score';
import { AlbumTrackForRating } from '@/features/ratings/queries';
import {
  IconBubble,
  IconClock,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';
import { AlbumTrack } from '@/features/albums/queries';

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

  // Exclude the current user's own rating from the public list so it
  // isn't shown twice once rotation ends.
  const otherComments = userId
    ? comments.filter(rating => rating.user.id !== userId)
    : comments;

  // What this user can actually see right now: just their own comment
  // during rotation, everyone's once ratings go public.
  const visibleCommentCount = ratingsArePublic
    ? comments.length
    : userComment
      ? 1
      : 0;

  return (
    <div className='flex flex-col w-full rounded-md hover:bg-orange-100 dark:hover:bg-slate-900 transition-colors'>
      <div className='group flex flex-row justify-start items-center px-2 py-4 gap-6'>
        <span className='font-mono text-xs text-gray-600 dark:text-gray-400 group-hover:text-ember'>
          {String(track.number).padStart(2, '0')}
        </span>
        <span className='text-md font-text text-gray-800 dark:text-gray-200 flex-1'>
          {track.title}
        </span>

        <div className='flex flex-col justify-center items-center gap-1.5'>
          <IconUser size={16} className='text-gray-600 dark:text-gray-400' />
          <span className='font-mono text-xs text-gray-500'>
            {userTrackRating?.score ? (
              <RatingScore ratingScore={userTrackRating.score} size='sm' />
            ) : (
              '—'
            )}
          </span>
        </div>

        <div className='flex flex-row items-center gap-2.5'>
          <div className='flex flex-col justify-center items-center gap-1'>
            <IconWorld size={16} className='text-gray-600 dark:text-gray-400' />
            <span className='text-gray-600 dark:text-white'>
              {ratingsArePublic && track.averageRating ? (
                <RatingScore ratingScore={track.averageRating} size='sm' />
              ) : ratingsArePublic ? (
                '-'
              ) : (
                <IconClock size={14} className='text-gray-500 mt-1' />
              )}
            </span>
          </div>
        </div>

        {/* Always rendered now — count/behavior reflects what's visible
            to this user, not just the public aggregate. */}
        <button
          type='button'
          onClick={() =>
            visibleCommentCount > 0 && setShowComments(prev => !prev)
          }
          disabled={visibleCommentCount === 0}
          className='flex flex-col items-center gap-1 disabled:cursor-default'
        >
          <IconBubble
            size={16}
            className={visibleCommentCount > 0 ? 'text-ember' : 'text-gray-500'}
          />
          <span
            className={`font-mono text-xs ${
              visibleCommentCount > 0 ? 'text-ember' : 'text-gray-500'
            }`}
          >
            {visibleCommentCount}
          </span>
        </button>
      </div>

      {showComments && (
        <div className='flex flex-col gap-3 px-10 pb-4'>
          {/* The user's own comment — visible in or out of rotation,
              but only when the list is toggled open like everyone else's. */}
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

          {/* Everyone else's comments, only once rotation has ended. */}
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
