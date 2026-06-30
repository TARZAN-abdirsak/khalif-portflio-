import { useState, useEffect, useRef, type RefObject } from 'react';

/**
 * Tracks how far the user has scrolled through a tall container.
 * Returns a value from 0 to 1.
 */
export function useScrollProgress<T extends HTMLElement>(): [RefObject<T>, number] {
  const ref = useRef<T>(null!);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onScroll() {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;

      // How far we've scrolled into the container
      // 0 = top of container just reached viewport top
      // 1 = bottom of container just leaving viewport top
      const scrollable = el.offsetHeight - windowH;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }

      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / scrollable));
      setProgress(p);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return [ref, progress];
}
