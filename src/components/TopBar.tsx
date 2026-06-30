import { ThemeToggle } from './ThemeToggle';

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#expertise', label: 'Expertise' },
  { href: '#approach', label: 'Services' },
  { href: '#engagements', label: 'Engagements' },
] as const;

export function TopBar() {
  return (
    <header className="topbar">
      <a href="#top" className="brand" aria-label="Khalif Rooble — home">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect
            x="16"
            y="2"
            width="19.8"
            height="19.8"
            transform="rotate(45 16 2)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M16 9 L16 23 M16 16 L22 10 M16 16 L22 22"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span className="brand-word">Khalif&nbsp;Rooble</span>
      </a>

      <nav className="topnav" aria-label="Primary">
        {NAV.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="topbar-actions">
        <ThemeToggle />
        <a href="mailto:khalif.rooble@consulting.co" className="book-call">
          Book A Call <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}
