// hooks/useResponsiveCardCount.ts
import { useEffect, useState } from 'react';

const BREAKPOINTS: { minWidth: number; count: number }[] = [
  { minWidth: 1920, count: 7 }, // 2xl
  { minWidth: 1536, count: 6 }, // 2xl
  { minWidth: 1280, count: 5 }, // xl
  { minWidth: 1024, count: 4 }, // lg
  { minWidth: 768, count: 3 }, // md
];

export function useResponsiveCardCount(fallback: number) {
  const [count, setCount] = useState(fallback);

  function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), ms);
    };
  }

  useEffect(() => {
    const getCount = () => {
      const width = window.innerWidth;
      const match = BREAKPOINTS.find(bp => width >= bp.minWidth);
      return match ? match.count : fallback;
    };

    const update = () => setCount(getCount());
    const debouncedUpdate = debounce(update, 150);
    window.addEventListener('resize', debouncedUpdate);
    return () => window.removeEventListener('resize', debouncedUpdate);
  }, [fallback]);

  return count;
}
