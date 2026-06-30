import { useReveal } from '../hooks/useReveal';

interface Props {
  num: string;
  label: string;
  meta: string;
}

export function SectionHead({ num, label, meta }: Props) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div className="section-head reveal" ref={ref}>
      <div className="section-index">
        <span className="num">{num}</span>
        <span className="label">— {label}</span>
      </div>
      <div className="section-meta">{meta}</div>
    </div>
  );
}
