import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { skills } from '../data/skills';
import { SectionHead } from './SectionHead';
import type { Skill } from '../types';

export function Expertise() {
  const fanRef = useRef<HTMLDivElement>(null);
  const [openSkill, setOpenSkill] = useState<Skill | null>(null);
  const [vw, setVw] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280,
  );

  // Track viewport width so the spread distance can adapt responsively.
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Scroll-driven spread: cards start in a neat stack at centre and fan
  // out toward the sides as the section scrolls toward the viewport centre.
  // We write progress (0 → 1) to a CSS var so the GPU does the layout.
  useEffect(() => {
    const el = fanRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const wh = window.innerHeight || 1;
      const centre = rect.top + rect.height / 2;
      // 0 when the fan's centre sits at the bottom of the viewport,
      // 1 once it has risen to ~45% up the screen.
      const p = Math.max(0, Math.min(1, (wh - centre) / (wh * 0.55)));
      el.style.setProperty('--p', p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Prevent background scroll when the detail sheet is open.
  useEffect(() => {
    if (openSkill) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openSkill]);

  // Escape key closes detail sheet.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSkill(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Close the sheet when hash changes (i.e. navigation occurs via topbar or browser back button)
  useEffect(() => {
    const handleHashChange = () => {
      setOpenSkill(null);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <section id="expertise">
      <SectionHead num="03" label="Expertise" meta="Four Practices · One Discipline" />

      <div className="expertise-fan" ref={fanRef}>
        {skills.map((skill, i) => {
          // Adjust distance (spread) dynamically based on viewport width
          const gap = vw < 1024 ? (vw < 900 ? 210 : 250) : 300;
          const x = (i - 1.5) * gap;
          const y = Math.abs(i - 1.5) * 15; // subtle arch shape
          const rot = (i - 1.5) * 8; // fanned rotation
          const z = i === 1 || i === 2 ? 10 : 5;

          const style: CSSProperties = {
            '--x': `${x}px`,
            '--y': `${y}px`,
            '--rot': `${rot}deg`,
            '--z': z,
          } as CSSProperties;

          return (
            <button
              key={skill.number}
              className="fan-card"
              style={style}
              onClick={() => setOpenSkill(skill)}
            >
              <div className="fan-card-icon" aria-hidden="true">
                {skill.icon}
              </div>
              <div className="fan-card-body">
                <span className="fan-card-index">{skill.index}</span>
                <h3 className="fan-card-title">
                  {skill.titleLeft}{' '}
                  <span className="italic">{skill.titleRight}</span>
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {openSkill && (
        <div className="service-sheet">
          <div className="service-sheet-inner">
            <header className="service-sheet-bar">
              <span className="service-eyebrow">
                Services <span className="accent">/ {openSkill.index}</span>
              </span>
              <button
                className="service-back"
                onClick={() => setOpenSkill(null)}
                aria-label="Back to services"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back</span>
              </button>
            </header>

            <div className="service-head">
              <h2 className="service-title">
                {openSkill.titleLeft}
                <span className="italic">{openSkill.titleRight}</span>
              </h2>
              <span className="service-page" aria-hidden="true">
                {openSkill.number.split('/')[0].trim()}
              </span>
            </div>

            <div className="service-grid">
              <section className="service-block">
                <h3 className="service-block-title">
                  {openSkill.capabilitiesTitle || 'Deliverables'}
                </h3>
                <ul className="service-points">
                  {openSkill.capabilities.map((cap) => (
                    <li key={cap}>{cap}</li>
                  ))}
                </ul>
              </section>

              <section className="service-block">
                <h3 className="service-block-title">
                  {openSkill.kpisTitle || 'Example KPIs'}
                </h3>
                <ul className="service-points">
                  {openSkill.kpis.map((kpi) => (
                    <li key={kpi}>{kpi}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
