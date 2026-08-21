'use client';

import { useState } from 'react';
import Image from 'next/image';
import RatingGrade from '@/components/dashboard/rating-grade';
import { AlbumTrackForRating } from '@/data/tracks';
import {
  IconBubble,
  IconClock,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';
import { AlbumTrack } from '@/data/albums';

export default function AlbumTracksRow({
  track,
  userTrackRating,
  finalized,
}: {
  track: AlbumTrack;
  userTrackRating: AlbumTrackForRating | undefined;
  finalized: boolean;
}) {
  const [showComments, setShowComments] = useState(false);

  const comments = track.ratings.filter(rating => rating.comment != null);
  const commentCount = comments.length;

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
              <RatingGrade ratingGrade={userTrackRating.score} size='sm' />
            ) : (
              '—'
            )}
          </span>
        </div>

        <div className='flex flex-row items-center gap-2.5'>
          <div className='flex flex-col justify-center items-center gap-1'>
            <IconWorld size={16} className='text-gray-600 dark:text-gray-400' />
            <span className='text-gray-600 dark:text-white'>
              {finalized && track.averageRating ? (
                <RatingGrade ratingGrade={track.averageRating} size='sm' />
              ) : finalized ? (
                '-'
              ) : (
                <IconClock size={14} className='text-gray-500 mt-1' />
              )}
            </span>
          </div>
        </div>

        {finalized && (
          <button
            type='button'
            onClick={() => commentCount > 0 && setShowComments(prev => !prev)}
            disabled={commentCount === 0}
            className='flex flex-col items-center gap-1 disabled:cursor-default'
          >
            <IconBubble
              size={16}
              className={commentCount > 0 ? 'text-ember' : 'text-gray-500'}
            />
            <span
              className={`font-mono text-xs ${
                commentCount > 0 ? 'text-ember' : 'text-gray-500'
              }`}
            >
              {commentCount}
            </span>
          </button>
        )}
      </div>

      {showComments && commentCount > 0 && (
        <div className='flex flex-col gap-3 px-10 pb-4'>
          {comments.map(rating => (
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
                    <RatingGrade ratingGrade={rating.score} size='sm' />
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
