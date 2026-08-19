import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { cn } from '@/lib/utils';

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const normalizedValue = Array.isArray(value)
    ? value
    : typeof value === 'number'
      ? [value]
      : Array.isArray(defaultValue)
        ? defaultValue
        : [min];

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
        {/* Added explicit h-1.5 (height) and bg-neutral-800 for the track */}
        <SliderPrimitive.Track
          data-slot='slider-track'
          className='relative h-1.5 w-full grow overflow-hidden rounded-md bg-neutral-800 select-none'
        >
          {/* Added explicit h-full and bg-white (or bg-amber-500) for the active range */}
          <SliderPrimitive.Indicator
            data-slot='slider-range'
            className='h-full bg-white select-none'
          />
        </SliderPrimitive.Track>

        {Array.from({ length: normalizedValue.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot='slider-thumb'
            key={index}
            className='relative block size-4 shrink-0 rounded-full border border-ring bg-white ring-ring/30 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-2 focus-visible:ring-2 focus-visible:outline-hidden active:ring-2 disabled:pointer-events-none disabled:opacity-50'
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
