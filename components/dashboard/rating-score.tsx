type RatingScoreProps = {
  ratingScore: number | null | undefined;
  inAlbum?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  withBackground?: boolean;
};

const SIZE_CLASSES: Record<NonNullable<RatingScoreProps['size']>, string> = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-lg',
};
const COLOR_MAP = [
  {
    threshold: 80,
    textOnly: 'text-emerald-400',
    text: 'text-white',
    bg: 'bg-emerald-600',
  },
  {
    threshold: 70,
    textOnly: 'text-lime-500',
    text: 'text-white',
    bg: 'bg-lime-500',
  },
  {
    threshold: 60,
    textOnly: 'text-amber-400',
    text: 'text-white',
    bg: 'bg-amber-600',
  },
  {
    threshold: 40,
    textOnly: 'text-orange-400',
    text: 'text-white',
    bg: 'bg-orange-600',
  },
] as const;

const DEFAULT = {
  textOnly: 'text-red-400',
  text: 'text-white',
  bg: 'bg-red-600',
};

function getRatingColor(ratingScore: number, withBackground = false): string {
  const match =
    COLOR_MAP.find(({ threshold }) => ratingScore >= threshold) ?? DEFAULT;

  return withBackground
    ? `${match.text} ${match.bg} rounded-sm`
    : match.textOnly;
}

export default function RatingScore({
  ratingScore,
  inAlbum = false,
  size = 'md',
  label,
  withBackground = false,
}: RatingScoreProps) {
  const hasScore = ratingScore != null;
  const displayScore = hasScore ? Math.round(ratingScore) : null;

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
