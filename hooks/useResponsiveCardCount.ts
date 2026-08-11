import { useEffect, useState } from 'react';

export function useResponsiveCardCount(defaultCount: number) {
  const [count, setCount] = useState(defaultCount);

  useEffect(() => {
    function updateCount() {
      const width = window.innerWidth;

      if (width >= 1280) {
        setCount(defaultCount);
      } else if (width >= 1024) {
        setCount(Math.max(2, defaultCount - 1));
      } else if (width >= 768) {
        setCount(Math.max(1, defaultCount - 2));
      } else {
        setCount(1);
      }
    }

    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, [defaultCount]);

  return count;
}
