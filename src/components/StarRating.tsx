import { useState } from 'react';

interface Props {
  value: number;
  /** When provided the stars become interactive. */
  onChange?: (value: number) => void;
  /** Pixel size of each star. */
  size?: number;
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`star ${filled ? 'star--on' : ''}`} aria-hidden="true">
      <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.9l-5.8 3.07 1.1-6.47L2.6 9.9l6.5-.95L12 2.5z" />
    </svg>
  );
}

export function StarRating({ value, onChange, size = 18 }: Props) {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === 'function';
  const shown = hover || value;

  if (!interactive) {
    return (
      <div className="stars" aria-label={`${value} out of 5 stars`} style={{ ['--star-size' as string]: `${size}px` }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} filled={n <= value} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="stars stars--input"
      role="radiogroup"
      aria-label="Rating"
      style={{ ['--star-size' as string]: `${size}px` }}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          className="star-btn"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onClick={() => onChange?.(n)}
        >
          <Star filled={n <= shown} />
        </button>
      ))}
    </div>
  );
}
