import { useEffect, useRef } from 'react';

/**
 * Adds `.in` to the element when it scrolls into view.
 * Pair with the `.reveal` class in CSS for the fade-up animation.
 */
export function useReveal<T extends HTMLElement>(): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
