import { ThemeToggle } from './ThemeToggle';

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#expertise', label: 'Expertise' },
  { href: '#services', label: 'Services' },
  { href: '#engagements', label: 'Engagements' },
] as const;

export function TopBar() {
  return (
    <header className="topbar">
      <a href="#top" className="brand" aria-label="Khalif Rooble — home">
        <img src="/kr-logo.png" alt="KR Logo" className="brand-logo brand-logo--day" />
        <img src="/kr-logo-white.png" alt="" aria-hidden="true" className="brand-logo brand-logo--night" />
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
        <a href="https://wa.me/252614177744" target="_blank" rel="noopener noreferrer" className="book-call">
          Call Me <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}
