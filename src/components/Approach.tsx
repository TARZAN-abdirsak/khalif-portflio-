import { approachSteps } from '../data/approach';
import { useReveal } from '../hooks/useReveal';
import { SectionHead } from './SectionHead';

export function Approach() {
  const listRef = useReveal<HTMLDivElement>();

  return (
    <section id="approach">
      <SectionHead num="04" label="Approach" meta="How Engagements Run" />

      <div className="approach-list reveal" ref={listRef}>
        {approachSteps.map((step) => (
          <div className="approach-row" key={step.numeral}>
            <div className="approach-num">{step.numeral}</div>
            <div className="approach-title">{step.title}</div>
            <div className="approach-desc">{step.description}</div>
            <div className="approach-tag">{step.phase}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
