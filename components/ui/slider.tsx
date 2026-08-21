import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { cn } from '@/lib/utils';

function scoreColors(score: number) {
  if (score < 60) {
    return {
      indicator: 'bg-red-500',
      trackHover: 'group-hover/track:bg-red-950',
      thumbRing: 'ring-red-500/30',
    };
  }
  if (score < 80) {
    return {
      indicator: 'bg-amber-500',
      trackHover: 'group-hover/track:bg-amber-950',
      thumbRing: 'ring-amber-500/30',
    };
  }
  return {
    indicator: 'bg-emerald-500',
    trackHover: 'group-hover/track:bg-emerald-950',
    thumbRing: 'ring-emerald-500/30',
  };
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  score,
  ...props
}: SliderPrimitive.Root.Props & { score?: number }) {
  const normalizedValue = Array.isArray(value)
    ? value
    : typeof value === 'number'
      ? [value]
      : Array.isArray(defaultValue)
        ? defaultValue
        : [min];

  const resolvedScore = score ?? normalizedValue[0] ?? 0;
  const c = scoreColors(resolvedScore);

  return (
    <SliderPrimitive.Root
      className={cn('w-full', className)}
      data-slot='slider'
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment='edge'
      {...props}
    >
      <SliderPrimitive.Control className='relative flex w-full touch-none items-center select-none data-disabled:opacity-50'>
        <SliderPrimitive.Track
          data-slot='slider-track'
          className={cn(
            'group/track relative h-1.5 w-full grow overflow-hidden rounded-md bg-neutral-800 transition-colors select-none',
            c.trackHover
          )}
        >
          <SliderPrimitive.Indicator
            data-slot='slider-range'
            className={cn('h-full transition-colors select-none', c.indicator)}
          />
        </SliderPrimitive.Track>

        {Array.from({ length: normalizedValue.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot='slider-thumb'
            key={index}
            className={cn(
              'relative block size-4 shrink-0 rounded-full border border-ring bg-white transition-[transform,box-shadow] select-none after:absolute after:-inset-2',
              'hover:scale-110 focus-visible:scale-110 focus-visible:outline-hidden active:scale-125 active:ring-2',
              c.thumbRing,
              'disabled:pointer-events-none disabled:opacity-50'
            )}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
