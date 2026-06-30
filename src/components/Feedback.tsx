import { useEffect, useMemo, useRef, useState } from 'react';
import { seedTestimonials } from '../data/testimonials';
import type { Testimonial } from '../types';
import { SectionHead } from './SectionHead';
import { StarRating } from './StarRating';

const STORAGE_KEY = 'feedback.testimonials';

/**
 * On the very first visit we seed localStorage with the defaults, after
 * which the stored list is the single source of truth — so every review,
 * including the seeded ones, can be deleted. An empty list stays empty.
 */
function loadInitial(): Testimonial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTestimonials));
      return seedTestimonials;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return seedTestimonials;
  }
}

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
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setItems(loadInitial());
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

  const all = items;
  const average = useMemo(
    () => (all.length ? all.reduce((s, t) => s + t.rating, 0) / all.length : 0),
    [all],
  );

  const persist = (next: Testimonial[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage full / unavailable — keep in memory */
    }
  };

  const remove = (id: string) => {
    persist(items.filter((t) => t.id !== id));
    setConfirmId(null);
  };

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setError('Please add your name and a short message.');
      return;
    }
    if (form.rating < 1) {
      setError('Please pick a star rating.');
      return;
    }
    const entry: Testimonial = {
      id: `u-${Date.now()}`,
      name: form.name.trim(),
      title: form.title.trim(),
      company: form.company.trim() || undefined,
      rating: form.rating,
      message: form.message.trim(),
      image: form.image || undefined,
      date: new Date().toISOString(),
    };
    persist([entry, ...items]);
    setForm(emptyForm);
    setError('');
    setOpen(false);
  };

  return (
    <section id="feedback">
      <SectionHead num="06" label="Feedback" meta="What Clients Say" />

      <div className="fb-bar">
        <div className="fb-score">
          <span className="fb-score-num">{average.toFixed(1)}</span>
          <div className="fb-score-meta">
            <StarRating value={Math.round(average)} size={16} />
            <span className="fb-score-count">{all.length} reviews</span>
          </div>
        </div>
        <button type="button" className="fb-cta" onClick={() => setOpen(true)}>
          Share your experience
        </button>
      </div>

      <div className="fb-grid">
        {all.length === 0 && (
          <p className="fb-empty">No reviews yet — be the first to share one.</p>
        )}
        {all.map((t) => (
          <article className="fb-card" key={t.id}>
            <button
              type="button"
              className="fb-del"
              onClick={() => setConfirmId(t.id)}
              aria-label={`Delete review from ${t.name}`}
              title="Delete review"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
              </svg>
            </button>

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

            {confirmId === t.id && (
              <div className="fb-confirm" role="alertdialog" aria-label="Confirm delete">
                <p>Delete this review?</p>
                <div className="fb-confirm-actions">
                  <button
                    type="button"
                    className="fb-btn-ghost"
                    onClick={() => setConfirmId(null)}
                  >
                    Cancel
                  </button>
                  <button type="button" className="fb-btn-danger" onClick={() => remove(t.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
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
                <button type="submit" className="fb-btn-primary">
                  Submit feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
