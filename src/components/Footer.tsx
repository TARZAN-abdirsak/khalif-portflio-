import { useState, type FormEvent } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
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
            <li><a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Social</h4>
          <ul className="footer-col-links">
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                (X) Twitter
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="footer-col footer-col-newsletter">
          <h4 className="footer-col-title">Newsletter</h4>
          <p className="footer-newsletter-desc">
            Subscribe to stay up to date with the latest news and projects.
          </p>
          {subscribed ? (
            <p className="footer-success-message">Thank you for subscribing!</p>
          ) : (
            <form className="footer-newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder="Email address"
                className="footer-newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="footer-newsletter-btn">
                Subscribe
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
