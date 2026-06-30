import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Msg {
  role: 'user' | 'model';
  text: string;
}

const GREETING =
  "Hi — I'm Khalif's assistant. Ask me about his services, experience, or how to work " +
  'with him, and I can pass your details along so he can reach out.';

/** Inline **bold** → <strong>; everything else stays plain text (React-escaped). */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    const b = part.match(/^\*\*([^*]+)\*\*$/);
    return b ? <strong key={i}>{b[1]}</strong> : <span key={i}>{part}</span>;
  });
}

/** Lightweight, safe markdown: paragraphs, blank-line gaps, and - / • bullets. */
function renderRich(text: string): ReactNode {
  const out: ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (!bullets.length) return;
    out.push(
      <ul className="cw-md-list" key={`ul-${out.length}`}>
        {bullets.map((b, i) => (
          <li key={i}>{inline(b)}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)/);
    if (bullet) {
      bullets.push(bullet[1]);
      continue;
    }
    flush();
    if (line) out.push(<p className="cw-md-p" key={`p-${out.length}`}>{inline(line)}</p>);
  }
  flush();
  return out;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const next: Msg[] = [...messages, { role: 'user', text }];
    setMessages(next);
    setInput('');
    setSending(true);
    setFailed(false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error('bad status');
      const data = (await res.json()) as { reply: string };
      setMessages((m) => [...m, { role: 'model', text: data.reply }]);
    } catch {
      setFailed(true);
      setMessages((m) => [
        ...m,
        { role: 'model', text: "Sorry — I couldn't reach the assistant. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button
        type="button"
        className={`cw-fab${open ? ' cw-fab--open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
          </svg>
        )}
      </button>

      {open && (
        <div className="cw-panel" role="dialog" aria-label="Khalif's assistant">
          <header className="cw-head">
            <img src="/logo-for-bage.png" alt="Avatar" className="cw-avatar" style={{ objectFit: 'cover' }} />
            <div className="cw-head-meta">
              <span className="cw-title">Khalif's Assistant</span>
              <span className="cw-status">Usually replies instantly</span>
            </div>
          </header>

          <div className="cw-body" ref={scrollRef}>
            <div className="cw-msg cw-msg--bot">{GREETING}</div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`cw-msg ${m.role === 'user' ? 'cw-msg--user' : 'cw-msg--bot'}`}
              >
                {m.role === 'model' ? renderRich(m.text) : m.text}
              </div>
            ))}
            {sending && (
              <div className="cw-msg cw-msg--bot cw-typing" aria-label="Assistant is typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>

          <div className="cw-input">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Message"
            />
            <button
              type="button"
              className="cw-send"
              onClick={send}
              disabled={sending || !input.trim()}
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 12l16-7-7 16-2-7-7-2z" />
              </svg>
            </button>
          </div>
          {failed && <p className="cw-error">Connection problem — your message wasn't sent.</p>}
        </div>
      )}
    </>
  );
}
