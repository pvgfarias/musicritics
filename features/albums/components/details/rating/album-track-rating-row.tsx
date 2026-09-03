import { AlbumTrackForRating } from '@/features/tracks/queries';
import { IconMessageCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import RatingScore from '@/components/dashboard/rating-score';

function scoreColor(score: number | null) {
  if (score === null) return 'text-gray-500';
  if (score < 40) return 'text-red-400';
  if (score < 70) return 'text-amber-400';
  return 'text-ember';
}

export default function TrackRatingRow({
  track,
  score,
  comment,
  onScoreChange,
  onCommentChange,
}: {
  track: AlbumTrackForRating;
  score: number | null;
  comment: string;
  onScoreChange: (score: number) => void;
  onCommentChange: (comment: string) => void;
}) {
  const [showComment, setShowComment] = useState(!!comment);
  const displayScore = score ?? 50;

  return (
    <div className='flex flex-col gap-1 py-1 '>
      <div className='flex flex-row justify-start items-center py-4 gap-6'>
        <span className='font-mono text-xs text-gray-600 dark:text-gray-500 group-hover:text-ember'>
          {String(track.number).padStart(2, '0')}
        </span>
        <span className='text-md font-text text-gray-800 dark:text-gray-200 flex-1'>
          {track.title}
        </span>
        <button
          onClick={() => setShowComment(v => !v)}
          className={
            comment ? 'text-ember' : 'text-gray-600 hover:text-gray-300'
          }
        >
          <IconMessageCircle size={15} />
        </button>
        <span
          className={`text-sm font-semibold tabular-nums w-7 text-right ${scoreColor(score)}`}
        >
          {score === null ? '–' : <RatingScore ratingScore={score} size='sm' />}
        </span>
      </div>
      <Slider
        min={1}
        max={100}
        step={1}
        value={[displayScore]}
        onValueChange={val => {
          const nextVal = Array.isArray(val) ? val[0] : val;
          if (nextVal !== undefined) onScoreChange(nextVal);
        }}
        className='w-full'
      />

      {showComment && (
        <textarea
          value={comment}
          onChange={e => onCommentChange(e.target.value)}
          onBlur={() => {
            if (!comment) setShowComment(false);
          }}
          placeholder='Add a note…'
          className='text-xs bg-transparent border border-gray-700 rounded-md p-1.5 resize-none focus:border-ember outline-none mt-2'
          rows={1}
          autoFocus
        />
      )}
    </div>
  );
}
