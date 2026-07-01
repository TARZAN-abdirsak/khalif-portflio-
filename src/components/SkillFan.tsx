import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { SectionHead } from './SectionHead';
import type { Skill } from '../types';

interface SkillFanProps {
  id: string;
  num: string;
  label: string;
  meta: string;
  /** Eyebrow shown in the detail sheet, e.g. "Expertise" or "Services". */
  eyebrow: string;
  items: Skill[];
}

/**
 * Scroll-driven fan of skill cards, reused for both the Expertise and Services
 * sections. Cards start stacked at centre and fan out as the section rises.
 */
export function SkillFan({ id, num, label, meta, eyebrow, items }: SkillFanProps) {
  const fanRef = useRef<HTMLDivElement>(null);
  const [openSkill, setOpenSkill] = useState<Skill | null>(null);
  const [vw, setVw] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280,
  );

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = fanRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const wh = window.innerHeight || 1;
      const centre = rect.top + rect.height / 2;
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

  useEffect(() => {
    document.body.style.overflow = openSkill ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openSkill]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSkill(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const handleHashChange = () => setOpenSkill(null);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const mid = (items.length - 1) / 2;

  return (
    <section id={id}>
      <SectionHead num={num} label={label} meta={meta} />

      <div className="expertise-fan" ref={fanRef}>
        {items.map((skill, i) => {
          const gap = vw < 1024 ? (vw < 900 ? 210 : 250) : 300;
          const x = (i - mid) * gap;
          const y = Math.abs(i - mid) * 15;
          const rot = (i - mid) * 8;
          const z = Math.round(10 - Math.abs(i - mid) * 3);

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
                  {skill.titleLeft} <span className="italic">{skill.titleRight}</span>
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
                {eyebrow} <span className="accent">/ {openSkill.index}</span>
              </span>
              <button
                className="service-back"
                onClick={() => setOpenSkill(null)}
                aria-label="Back"
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
