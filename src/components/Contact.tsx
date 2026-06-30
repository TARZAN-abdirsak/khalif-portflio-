import { useReveal } from '../hooks/useReveal';

const EMAIL = 'khalif.rooble@consulting.co';

const CHANNELS = [
  { href: '#', label: 'LinkedIn ↗' },
  { href: '#', label: 'Calendar ↗' },
  { href: '#', label: 'Capabilities · PDF ↓' },
] as const;

export function Contact() {
  const eyebrowRef = useReveal<HTMLDivElement>();
  const statementRef = useReveal<HTMLHeadingElement>();
  const emailRef = useReveal<HTMLAnchorElement>();
  const channelsRef = useReveal<HTMLDivElement>();

  return (
    <section id="contact" className="contact">
      <div
        className="section-index contact-eyebrow reveal"
        ref={eyebrowRef}
        style={{ justifyContent: 'center' }}
      >
        <span className="num">07</span>
        <span className="label">— Begin a Conversation</span>
      </div>

      <h2 className="contact-statement reveal" ref={statementRef}>
        Let's build something <span className="italic">that lasts.</span>
      </h2>

      <a
        href={`mailto:${EMAIL}`}
        className="contact-email reveal"
        ref={emailRef}
      >
        {EMAIL}
      </a>

      <div className="contact-channels reveal" ref={channelsRef}>
        {CHANNELS.map((c) => (
          <a key={c.label} href={c.href}>
            {c.label}
          </a>
        ))}
      </div>
    </section>
  );
}
