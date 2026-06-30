import { useState, type FormEvent } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (!email.trim() || !message.trim()) {
      setError('Please add your email and a message.');
      return;
    }

    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), message: message.trim() }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? 'Could not send.');
      }
      setStatus('sent');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus('idle');
      setError(err instanceof Error ? err.message : 'Could not send — please try again.');
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-top-heading">
        <span className="footer-large-text">Let's Work</span>
        <span className="footer-large-text footer-text-right">Together</span>
      </div>

      <div className="footer-divider-line" />

      <div className="footer-grid">
        {/* Menu Column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Menu</h4>
          <ul className="footer-col-links">
            <li><a href="#expertise">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#feedback">Feedback</a></li>
          </ul>
        </div>

        {/* Social Column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Social</h4>
          <ul className="footer-col-links">
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://wa.me/252614177744" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-col footer-col-newsletter">
          <h4 className="footer-col-title">Get in touch</h4>
          {status === 'sent' ? (
            <p className="footer-success-message">
              Thanks — your message is on its way. Khalif will get back to you soon.
            </p>
          ) : (
            <form className="footer-newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder="Your email"
                className="footer-newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                required
                rows={3}
                placeholder="How can Khalif help?"
                className="footer-newsletter-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {error && <p className="footer-form-error">{error}</p>}
              <button type="submit" className="footer-newsletter-btn" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="footer-bottom-bar">
        <a href="#top" className="footer-to-top">
          To Top <span className="arrow">↑</span>
        </a>
        <div className="footer-meta-right">
          <span className="footer-location">Mogadishu, Somalia</span>
          <span className="footer-copyright">© 2026 Khalif Rooble</span>
        </div>
      </div>
    </footer>
  );
}
