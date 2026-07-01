import { CountUp } from './CountUp';

export function Hero() {
  return (
    <section className="hero" id="top">
      <span className="hero-side hero-side--label">Independent Consultant</span>
      <span className="hero-side hero-side--year">2026</span>

      <div className="hero-content hero-load">
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">
              <CountUp end={12} prefix="+" delay={250} />
            </span>
            <span className="hero-stat-label">Years in practice</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">
              <CountUp end={40} prefix="+" delay={400} />
            </span>
            <span className="hero-stat-label">Engagements delivered</span>
          </div>
        </div>

        <div className="hero-greeting">
          <h1 className="hero-hello">Hello</h1>
          <p className="hero-tagline">
            — I'm Khalif Rooble: Operations &amp; Development Manager | ERP Consultant | Accountant
          </p>
        </div>

        <a href="#about" className="hero-scroll">
          Scroll down <span className="arrow">↓</span>
        </a>
      </div>

      <div className="hero-photo">
        <img
          className="hero-img hero-img--day"
          src="/profile.png"
          alt="Portrait of Khalif Rooble"
        />
        <img
          className="hero-img hero-img--night"
          src="/profile_night.png"
          alt="Portrait of Khalif Rooble at night"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
