export default function RatingGrade({
  ratingGrade,
  inAlbum,
}: {
  ratingGrade: number;
  inAlbum: boolean;
}) {
  const ratingColor =
    ratingGrade >= 80
      ? 'bg-emerald-700/70 text-lime-200'
      : ratingGrade >= 60
        ? 'bg-amber-700/70 text-amber-200'
        : 'bg-red-700/70 text-red-200';

  const positioning = inAlbum ? 'absolute top-2 right-2 h-9 w-9' : '';

  return (
    <div
      className={`${ratingColor} ${positioning} shrink-0 rounded-full w-9 h-9 flex items-center justify-center shadow-sm`}
    >
      <span className='text-sm font-mono font-bold'>{ratingGrade}</span>
    </div>
  );
}
