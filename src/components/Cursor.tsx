import { useCursor } from '../hooks/useCursor';

export function Cursor() {
  const ref = useCursor();
  return <div className="cursor" ref={ref} aria-hidden="true" />;
}
