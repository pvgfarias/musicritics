import { useEffect, useRef, useState } from 'react';

export function useInfiniteScroll<T>(items: T[], pageSize: number) {
  // Bundles visibleCount together with the items array it was computed for.
  // Comparing state (not a ref) during render is React's documented pattern
  // for "reset derived state when a prop changes" — see:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [state, setState] = useState({ items, visibleCount: pageSize });

  if (state.items !== items) {
    setState({ items, visibleCount: pageSize });
  }

  const visibleCount = state.items === items ? state.visibleCount : pageSize;
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsLoadingMore(true);
          // Simulated delay so the skeleton is visible; drop the
          // setTimeout if this is ever backed by a real paginated fetch.
          setTimeout(() => {
            setState(prev => ({
              ...prev,
              visibleCount: Math.min(
                prev.visibleCount + pageSize,
                items.length
              ),
            }));
            setIsLoadingMore(false);
          }, 200);
        }
      },
      { rootMargin: '400px' } // start loading before it's on-screen
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, items, items.length, pageSize]);

  return { visibleItems, hasMore, isLoadingMore, sentinelRef };
}
