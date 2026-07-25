export default function WeeklyPicksBar({
  completed = 1,
  total = 2,
  daysLeft = 1,
}) {
  const pct = (completed / total) * 100;

  return (
    <div className='flex items-center gap-4 rounded-md border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm mb-4 font-mono'>
      <span className='whitespace-nowrap text-xs uppercase tracking-wider text-gray-500'>
        Weekly picks
      </span>

      <div className='h-2 flex-1 overflow-hidden rounded-full bg-gray-200'>
        <div
          className='h-full rounded-full bg-linear-to-r from-amber-600 to-amber-400 transition-all duration-700 ease-out'
          style={{ width: `${pct}%` }}
        />
      </div>

      <span className='whitespace-nowrap text-xs uppercase tracking-wider text-gray-500'>
        {completed} / {total}
      </span>

      <span className='whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-amber-700'>
        ⏱ {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
      </span>
    </div>
  );
}
