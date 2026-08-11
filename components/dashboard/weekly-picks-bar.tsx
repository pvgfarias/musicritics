export default function WeeklyPicksBar({
  completed = 1,
  total = 7,
  daysLeft = 1,
}) {
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className='flex items-center gap-4 shrink-0 w-full max-w-100 py-1 px-4 bg-foreground dark:bg-transparent rounded-full border border-gray-400 dark:border-mist-600 font-mono'>
      <span className='whitespace-nowrap text-xs uppercase tracking-wider text-gray-500 dark:text-white'>
        {completed} / {total}
      </span>

      <div className='h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-500'>
        <div
          className='h-full rounded-full bg-linear-to-r from-amber-200 to-ember transition-all duration-700 ease-out'
          style={{ width: `${pct}%` }}
        />
      </div>

      <span className='hidden md:block whitespace-nowrap text-xs uppercase tracking-wider text-gray-500 dark:text-gray-200'>
        ⏱ {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
      </span>
    </div>
  );
}
