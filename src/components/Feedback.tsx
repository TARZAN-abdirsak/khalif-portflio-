import { useEffect, useMemo, useRef, useState } from 'react';
import { seedTestimonials } from '../data/testimonials';
import type { Testimonial } from '../types';
import { SectionHead } from './SectionHead';
import { StarRating } from './StarRating';

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

/** Downscale an uploaded image to a small square avatar (data URL). */
function fileToAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode failed'));
      img.onload = () => {
        const S = 160;
        const canvas = document.createElement('canvas');
        canvas.width = S;
        canvas.height = S;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('no ctx'));
        const scale = Math.max(S / img.width, S / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const emptyForm = { name: '', title: '', company: '', message: '', rating: 0, image: '' };

export function Feedback() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load real, shared reviews from the API. If it isn't configured yet
  // (local dev / pre-deploy), fall back to the seed list so the section
  // still looks populated instead of broken.
  useEffect(() => {
    let alive = true;
    fetch('/api/feedback')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad status'))))
      .then((data: { items: Testimonial[] }) => {
        if (alive) setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch(() => {
        if (alive) setItems(seedTestimonials);
      })
      .finally(() => {
        if (alive) setStatus('ready');
      });
    return () => {
      alive = false;
    };
  }, []);

  // Lock scroll + Escape to close while the form is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const average = useMemo(
    () => (items.length ? items.reduce((s, t) => s + t.rating, 0) / items.length : 0),
    [items],
  );

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const avatar = await fileToAvatar(file);
      setForm((f) => ({ ...f, image: avatar }));
    } catch {
      setError('Could not read that image — try another.');
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.name.trim() || !form.message.trim()) {
      setError('Please add your name and a short message.');
      return;
    }
    if (form.rating < 1) {
      setError('Please pick a star rating.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          title: form.title.trim(),
          company: form.company.trim(),
          message: form.message.trim(),
          rating: form.rating,
          image: form.image,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? 'Could not submit.');
      }
      const { item } = (await res.json()) as { item: Testimonial };
      setItems((prev) => [item, ...prev]);
      setForm(emptyForm);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="feedback">
      <SectionHead num="06" label="Feedback" meta="What Clients Say" />

      <div className="fb-bar">
        <div className="fb-score">
          <span className="fb-score-num">{average.toFixed(1)}</span>
          <div className="fb-score-meta">
            <StarRating value={Math.round(average)} size={16} />
            <span className="fb-score-count">{items.length} reviews</span>
          </div>
        </div>
        <button type="button" className="fb-cta" onClick={() => setOpen(true)}>
          Share your experience
        </button>
      </div>

      <div className="fb-grid">
        {status === 'loading' && <p className="fb-empty">Loading reviews…</p>}
        {status === 'ready' && items.length === 0 && (
          <p className="fb-empty">No reviews yet — be the first to share one.</p>
        )}
        {items.map((t) => (
          <article className="fb-card" key={t.id}>
            <div className="fb-card-top">
              {t.image ? (
                <img className="fb-avatar" src={t.image} alt={t.name} />
              ) : (
                <span className="fb-avatar fb-avatar--initials" aria-hidden="true">
                  {initials(t.name)}
                </span>
              )}
              <div className="fb-who">
                <span className="fb-name">{t.name}</span>
                <span className="fb-role">
                  {t.title}
                  {t.company ? ` · ${t.company}` : ''}
                </span>
              </div>
            </div>
            <StarRating value={t.rating} size={15} />
            <p className="fb-message">{t.message}</p>
          </article>
        ))}
      </div>

      {open && (
        <div className="fb-modal-backdrop" onClick={() => setOpen(false)}>
          <div
            className="fb-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Share your feedback"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="fb-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>

            <h3 className="fb-modal-title">Share your experience</h3>

            <form className="fb-form" onSubmit={submit}>
              <div className="fb-field">
                <label>Rating</label>
                <StarRating
                  value={form.rating}
                  onChange={(rating) => setForm((f) => ({ ...f, rating }))}
                  size={28}
                />
              </div>

              <div className="fb-field">
                <label htmlFor="fb-message">Your feedback</label>
                <textarea
                  id="fb-message"
                  rows={4}
                  placeholder="What was working with Khalif like?"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
              </div>

              <div className="fb-row">
                <div className="fb-field">
                  <label htmlFor="fb-name">Name</label>
                  <input
                    id="fb-name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="fb-field">
                  <label htmlFor="fb-title">Title / Role</label>
                  <input
                    id="fb-title"
                    type="text"
                    placeholder="e.g. CFO"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
              </div>

              <div className="fb-field">
                <label htmlFor="fb-company">
                  Company <span className="fb-optional">(optional)</span>
                </label>
                <input
                  id="fb-company"
                  type="text"
                  placeholder="Leave blank if independent"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                />
              </div>

              <div className="fb-field">
                <label>
                  Photo <span className="fb-optional">(optional)</span>
                </label>
                <div className="fb-upload">
                  {form.image ? (
                    <img className="fb-avatar" src={form.image} alt="Preview" />
                  ) : (
                    <span className="fb-avatar fb-avatar--initials" aria-hidden="true">
                      {initials(form.name) || '—'}
                    </span>
                  )}
                  <button
                    type="button"
                    className="fb-upload-btn"
                    onClick={() => fileRef.current?.click()}
                  >
                    {form.image ? 'Change photo' : 'Upload photo'}
                  </button>
                  {form.image && (
                    <button
                      type="button"
                      className="fb-upload-remove"
                      onClick={() => setForm((f) => ({ ...f, image: '' }))}
                    >
                      Remove
                    </button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onPickImage}
                  />
                </div>
              </div>

              {error && <p className="fb-error">{error}</p>}

              <div className="fb-actions">
                <button type="button" className="fb-btn-ghost" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="fb-btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
