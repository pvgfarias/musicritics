export default function WeeklyPicksBar({
  completed = 1,
  total = 2,
  daysLeft = 1,
}) {
  const pct = (completed / total) * 100;

  return (
    <div className='flex items-center gap-4 w-120 py-1 px-4 bg-foreground rounded-full border  border-gray-300 dark:border-mist-600 font-mono '>
      <span className='whitespace-nowrap text-xs uppercase tracking-wider text-gray-500 dark:text-white'>
        Weekly Rotation
      </span>

      <div className='h-2 flex-1 overflow-hidden rounded-full bg-gray-200'>
        <div
          className='h-full rounded-full bg-linear-to-r from-summer-blue to-dark-blue transition-all duration-700 ease-out'
          style={{ width: `${pct}%` }}
        />
      </div>

      <span className='whitespace-nowrap text-xs uppercase tracking-wider text-gray-500 dark:text-white'>
        {completed} / {total}
      </span>

      <span className='hidden md:block whitespace-nowrap text-xs uppercase tracking-wider text-gray-500'>
        ⏱ {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
      </span>
    </div>
  );
}
