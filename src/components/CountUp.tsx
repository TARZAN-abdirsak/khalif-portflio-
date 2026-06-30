import { useEffect, useState } from 'react';

interface Props {
  /** Final value to count up to. */
  end: number;
  /** Animation length in ms. */
  duration?: number;
  /** Delay before counting starts, in ms. */
  delay?: number;
  prefix?: string;
  suffix?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts from 0 up to `end` once, on mount. Used for the hero stats so the
 * figures tick up to their real value when the page loads. Respects
 * prefers-reduced-motion (jumps straight to the final value).
 */
export function CountUp({ end, duration = 1500, delay = 0, prefix = '', suffix = '' }: Props) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setValue(end);
      return;
    }

    let raf = 0;
    let start = 0;
    const timer = window.setTimeout(() => {
      const tick = (now: number) => {
        if (!start) start = now;
        const t = Math.min(1, (now - start) / duration);
        setValue(Math.round(easeOutCubic(t) * end));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [end, duration, delay]);

  return (
    <span className="countup">
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
