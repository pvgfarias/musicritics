type RatingGradeProps = {
  ratingGrade: number | null | undefined;
  inAlbum?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  withBackground?: boolean;
};

const SIZE_CLASSES: Record<NonNullable<RatingGradeProps['size']>, string> = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-lg',
};

function getRatingColor(ratingGrade: number, withBackground = false): string {
  const COLOR_MAP = [
    { threshold: 80, color: 'emerald' },
    { threshold: 70, color: 'lime' },
    { threshold: 60, color: 'amber' },
    { threshold: 40, color: 'orange' },
  ] as const;

  const color =
    COLOR_MAP.find(({ threshold }) => ratingGrade >= threshold)?.color ?? 'red';

  return withBackground
    ? `text-${color}-400 bg-${color}-800`
    : `text-${color}-400`;
}

export default function RatingGrade({
  ratingGrade,
  inAlbum = false,
  size = 'md',
  label,
  withBackground = false,
}: RatingGradeProps) {
  const hasScore = ratingGrade != null;
  const displayScore = hasScore ? Math.round(ratingGrade) : null;

  const colorClasses = hasScore
    ? getRatingColor(displayScore!, withBackground)
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
