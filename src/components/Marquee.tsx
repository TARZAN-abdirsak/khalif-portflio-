const ITEMS = [
  'Financial Management',
  'Project Management',
  'ERP Consultancy',
  'Enterprise Advisory',
] as const;

export function Marquee() {
  // Two copies of the items so the seamless loop has content to translate into.
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {loop.map((item, idx) => (
          <span className="marquee-item" key={`${item}-${idx}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
