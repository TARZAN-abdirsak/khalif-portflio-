import { useEffect, useRef } from 'react';
import { engagements } from '../data/engagements';
import { SectionHead } from './SectionHead';

export function Engagements() {
  const treeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tree = treeRef.current;
    if (!tree) return;
    const nodes = Array.from(tree.querySelectorAll<HTMLElement>('.eng-node'));

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      tree.classList.add('in', 'scrolled');
      tree.style.setProperty('--p', '1');
      nodes.forEach((n) => n.classList.add('active'));
      return;
    }

    // Draw the spine in once the tree enters view.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            tree.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    io.observe(tree);

    // The light travels down with scroll; branches sprout as it passes.
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = tree.getBoundingClientRect();
      const wh = window.innerHeight || 1;
      const mid = wh * 0.52;
      const p = Math.max(0, Math.min(1, (mid - rect.top) / rect.height));
      tree.style.setProperty('--p', p.toFixed(4));
      tree.classList.toggle('scrolled', p > 0.02);
      for (const node of nodes) {
        const nr = node.getBoundingClientRect();
        const at = (nr.top + nr.height / 2 - rect.top) / rect.height;
        node.classList.toggle('active', p >= at);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="engagements">
      <SectionHead num="06" label="Selected Engagements" meta="2010 — Present" />

      <div className="eng-tree" ref={treeRef}>
        <div className="eng-scroll-hint" aria-hidden="true">
          <span>Scroll to trace the path</span>
          <span className="eng-scroll-arrow">↓</span>
        </div>

        <div className="eng-spine" aria-hidden="true">
          <span className="eng-spine-fill" />
          <span className="eng-spine-head" />
        </div>

        <ol className="eng-nodes">
          {engagements.map((eng, i) => (
            <li
              className={`eng-node eng-node--${i % 2 === 0 ? 'left' : 'right'}`}
              key={`${eng.year}-${eng.title}`}
            >
              <span className="eng-branch" aria-hidden="true" />
              <span className="eng-dot" aria-hidden="true" />
              <div className="eng-card">
                <span className="eng-year">{eng.year}</span>
                <span className="eng-title">{eng.title}</span>
                <span className="eng-client dim">{eng.client}</span>
                <span className="eng-tag">{eng.tag}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
