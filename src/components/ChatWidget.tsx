import { useEffect, useRef, useState } from 'react';

interface Msg {
  role: 'user' | 'model';
  text: string;
}

const GREETING =
  "Hi — I'm Khalif's assistant. Ask me about his services, experience, or how to work " +
  'with him, and I can pass your details along so he can reach out.';

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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 5h16v11H9l-5 4V5z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="cw-panel" role="dialog" aria-label="Khalif's assistant">
          <header className="cw-head">
            <span className="cw-avatar" aria-hidden="true">KR</span>
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
                {m.text}
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
