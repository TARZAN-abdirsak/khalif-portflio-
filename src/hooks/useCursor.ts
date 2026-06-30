import { useEffect, useRef } from 'react';

/**
 * Drives the custom cursor element: smooth follow + hover-scale on
 * interactive elements. Returns a ref to attach to the cursor node.
 */
export function useCursor(): React.RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = cx;
    let ty = cy;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      el.style.left = `${cx}px`;
      el.style.top = `${cy}px`;
      rafId = requestAnimationFrame(tick);
    };

    const interactiveSelector = 'a, button, .skill-card, .engagement, .approach-row';
    const onOver = (e: Event) => {
      const target = e.target as Element | null;
      if (target?.closest(interactiveSelector)) el.classList.add('hover');
    };
    const onOut = (e: Event) => {
      const target = e.target as Element | null;
      if (target?.closest(interactiveSelector)) el.classList.remove('hover');
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return ref;
}
