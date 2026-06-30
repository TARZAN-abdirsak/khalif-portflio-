import { useState, useEffect } from 'react';
import { SectionHead } from './SectionHead';

export function About() {
  // Spotify Widget State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [seconds, setSeconds] = useState(45); // Start at 0:45 for a realistic effect
  const totalDuration = 163; // 2:43 total duration

  // Progress timer effect
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSeconds((prev) => (prev >= totalDuration ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = (seconds / totalDuration) * 100;

  return (
    <section id="about">
      <SectionHead num="02" label="About" meta="A Brief Introduction" />

      <div className="about-wrapper-new">
        {/* Left Column: Spotify player and stacked 3D pills */}
        <aside className="about-left">
          {/* Glassmorphic Spotify Card */}
          <div className="spotify-widget">
            <header className="spotify-header">
              <div className="spotify-logo-group">
                <svg
                  className="spotify-icon-svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-1.026-.336.073-.668-.14-.74-.474-.072-.333.14-.665.474-.737 3.845-.878 7.144-.506 9.812 1.127.295.18.387.563.207.863zm1.224-2.723c-.226.367-.707.487-1.074.26-2.717-1.67-6.86-2.155-10.066-1.182-.413.125-.845-.107-.97-.52-.125-.413.107-.847.52-.972 3.666-1.112 8.232-.57 11.33 1.336.367.226.487.707.26 1.078zm.106-2.834C14.392 8.76 8.57 8.567 5.18 9.597c-.52.158-1.077-.143-1.235-.663-.158-.52.143-1.077.662-1.235 3.882-1.178 10.32-.953 14.427 1.487.47.28.623.89.343 1.358-.278.47-.887.625-1.357.345z" />
                </svg>
                <span>Now Playing</span>
              </div>
              <button
                className="spotify-mute-btn"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0-1.707-.707L13.586 8H12a3 3 0 0 0-3 1z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </button>
            </header>

            <div className="spotify-body">
              <div className={`spotify-album-cover ${isPlaying ? 'playing' : ''}`}>
                <img src="/about_editorial.png" alt="Last 1s Left Album Art" />
              </div>
              <div className="spotify-meta">
                <span className="spotify-track-title">Last 1s Left</span>
                <span className="spotify-artist">Skepta, Fred again..</span>
              </div>
              <div className="spotify-visualizer" aria-hidden="true">
                <span className={`visualizer-bar ${isPlaying ? 'playing' : ''}`} />
                <span className={`visualizer-bar ${isPlaying ? 'playing' : ''}`} />
                <span className={`visualizer-bar ${isPlaying ? 'playing' : ''}`} />
                <span className={`visualizer-bar ${isPlaying ? 'playing' : ''}`} />
              </div>
            </div>

            <footer className="spotify-footer-controls">
              <div className="spotify-progress-container">
                <span>{formatTime(seconds)}</span>
                <div className="spotify-progress-bar-bg">
                  <div
                    className="spotify-progress-bar-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span>{formatTime(totalDuration)}</span>
              </div>

              <div className="spotify-controls">
                <button
                  className="spotify-ctrl-btn"
                  onClick={() => setSeconds(Math.max(0, seconds - 10))}
                  aria-label="Skip backward 10 seconds"
                >
                  <svg viewBox="0 0 24 24">
                    <polygon points="11 19 2 12 11 5 11 19" />
                    <polygon points="22 19 13 12 22 5 22 19" />
                  </svg>
                </button>

                <button
                  className="spotify-ctrl-btn play-pause"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                </button>

                <button
                  className="spotify-ctrl-btn"
                  onClick={() => setSeconds(Math.min(totalDuration, seconds + 10))}
                  aria-label="Skip forward 10 seconds"
                >
                  <svg viewBox="0 0 24 24">
                    <polygon points="13 19 22 12 13 5 13 19" />
                    <polygon points="2 19 11 12 2 5 2 19" />
                  </svg>
                </button>
              </div>
            </footer>
          </div>

          {/* 3D Stacked Capability Pills */}
          <div className="pills-stack-3d">
            <span className="pill-3d pill-green">ERP &amp; Digital Transformation</span>
            <span className="pill-3d pill-purple">Healthcare Operations</span>
            <span className="pill-3d pill-blue">
              Financial Strategy <span className="pill-badge">new</span>
            </span>
            <span className="pill-3d pill-pink">System Optimization</span>
          </div>
        </aside>

        {/* Right Column: Editorial details */}
        <article className="about-right">
          <div className="about-eyebrow">
            <div className="about-eyebrow-box" />
            <span>What I Do &amp; Why It Matters</span>
          </div>

          <h3 className="about-lead-text">
            Many organizations struggle with fragmented workflows, disconnected systems, manual reporting, and operational inefficiencies that quietly erode profitability.
          </h3>

          <p className="about-body-text">
            I help organizations eliminate these challenges by aligning operations, finance, and technology into a single integrated ecosystem. By combining executive-level financial expertise with deep ERP implementation experience, healthcare operations knowledge, and advanced business intelligence capabilities, I design systems that deliver operational transparency, financial control, and sustainable growth.
          </p>

          <div className="about-gains-section">
            <h4 className="about-gains-title">What Clients Achieve:</h4>
            <ul className="about-gains-list">
              <li>Greater financial visibility</li>
              <li>Stronger internal controls</li>
              <li>Reduced operational inefficiencies</li>
              <li>Improved decision-making through real-time reporting</li>
              <li>Enhanced accountability across departments</li>
              <li>Sustainable and scalable business processes</li>
              <li>Higher profitability through process optimization</li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
