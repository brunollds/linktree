import { useCallback, useEffect, useState } from 'react';

// Tracks whether a horizontal scroller can move further in each direction.
// `ref` is a callback ref, so the scroller may mount after the first render.
export function useCarousel<T extends HTMLElement>(step: number) {
  const [node, setNode] = useState<T | null>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });

  const refresh = useCallback(() => {
    if (!node) return;
    setEdges({
      atStart: node.scrollLeft <= 8,
      atEnd: node.scrollLeft >= node.scrollWidth - node.clientWidth - 8,
    });
  }, [node]);

  useEffect(() => {
    if (!node) return;

    const frame = requestAnimationFrame(refresh);
    const observer = new ResizeObserver(refresh);
    observer.observe(node);
    node.addEventListener('scroll', refresh, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      node.removeEventListener('scroll', refresh);
    };
  }, [node, refresh]);

  const scroll = useCallback(
    (direction: 1 | -1) => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      node?.scrollBy({ left: direction * step, behavior: reduceMotion ? 'auto' : 'smooth' });
    },
    [node, step],
  );

  return { scrollerRef: setNode, ...edges, scroll };
}
