export default function RatingGrade({ ratingGrade }: { ratingGrade: number }) {
  const ratingColor =
    ratingGrade >= 80
      ? 'bg-emerald-500'
      : ratingGrade >= 60
        ? 'bg-amber-500'
        : 'bg-red-500';

  return (
    <div
      className={`absolute -right-2.5 -top-2.5 z-20 ${ratingColor} rounded-full border-2 border-mist-100 w-8 h-8 flex items-center justify-center`}
    >
      <h1 className='text-white text-sm font-bold'>{ratingGrade}</h1>
    </div>
  );
}
