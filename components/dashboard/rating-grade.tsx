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
const COLOR_MAP = [
  {
    threshold: 80,
    color: 'emerald',
    text: 'text-emerald-400',
    bg: 'bg-emerald-800',
  },
  { threshold: 70, color: 'lime', text: 'text-lime-400', bg: 'bg-lime-800' },
  { threshold: 60, color: 'amber', text: 'text-amber-400', bg: 'bg-amber-800' },
  {
    threshold: 40,
    color: 'orange',
    text: 'text-orange-400',
    bg: 'bg-orange-800',
  },
] as const;

const DEFAULT = { text: 'text-red-400', bg: 'bg-red-800' };

function getRatingColor(ratingGrade: number, withBackground = false): string {
  const match =
    COLOR_MAP.find(({ threshold }) => ratingGrade >= threshold) ?? DEFAULT;

  return withBackground ? `${match.text} ${match.bg}` : match.text;
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
      className={`${colorClasses} ${SIZE_CLASSES[size]} ${positioning} shrink-0 flex items-center justify-center `}
    >
      <span className='font-mono font-bold' aria-hidden='true'>
        {hasScore ? displayScore : '—'}
      </span>
    </div>
  );
}
