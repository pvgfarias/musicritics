type RatingGradeProps = {
  /** Score out of 100. Pass null/undefined when there's nothing to show yet
   *  (e.g. an open album with no public average, or a user who hasn't rated). */
  ratingGrade: number | null | undefined;
  /** Renders as an absolutely-positioned overlay badge (e.g. on an album cover). */
  inAlbum?: boolean;
  /** Smaller footprint for secondary badges, like a "your score" chip next to a primary badge. */
  size?: 'sm' | 'md' | 'lg';
  /** Optional label announced to screen readers, e.g. "Public rating" or "Your rating". */
  label?: string;
};

const SIZE_CLASSES: Record<NonNullable<RatingGradeProps['size']>, string> = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-lg',
};

function getRatingColor(ratingGrade: number) {
  if (ratingGrade >= 80) return 'text-lime-400';
  if (ratingGrade >= 60) return ' text-amber-400';
  return ' text-red-400';
}

export default function RatingGrade({
  ratingGrade,
  inAlbum = false,
  size = 'md',
  label,
}: RatingGradeProps) {
  const hasScore = ratingGrade != null;
  const displayScore = hasScore ? Math.round(ratingGrade) : null;

  const colorClasses = hasScore
    ? getRatingColor(displayScore!)
    : 'bg-neutral-700/70 text-neutral-300';

  const positioning = inAlbum ? 'absolute top-2 right-2' : '';

  return (
    <div
      role='img'
      aria-label={
        label
          ? `${label}: ${hasScore ? displayScore : 'not yet rated'}`
          : hasScore
            ? `Rating: ${displayScore} out of 100`
            : 'Not yet rated'
      }
      className={`${colorClasses} ${SIZE_CLASSES[size]} ${positioning} shrink-0 rounded-full flex items-center justify-center shadow-sm`}
    >
      <span className='font-mono font-bold' aria-hidden='true'>
        {hasScore ? displayScore : '—'}
      </span>
    </div>
  );
}
