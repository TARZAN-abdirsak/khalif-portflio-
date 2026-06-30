/**
 * Resend email helpers. Both notifications are best-effort: callers should
 * wrap them so a mail failure never blocks the primary action (saving data).
 * Env: RESEND_API_KEY, RESEND_FROM (verified domain sender), NOTIFY_EMAIL.
 * Optional: LOGO_URL (absolute https URL to a logo image shown in the header).
 */
import { Resend } from 'resend';

let client: Resend | null = null;

function getClient(): Resend {
  if (!client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY missing.');
    client = new Resend(key);
  }
  return client;
}

function from(): string {
  return process.env.RESEND_FROM ?? 'Khalif Portfolio <onboarding@resend.dev>';
}

function to(): string {
  const addr = process.env.NOTIFY_EMAIL;
  if (!addr) throw new Error('NOTIFY_EMAIL missing.');
  return addr;
}

const esc = (s: string) =>
  s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string));

/* ── Brand palette (modern, high-end corporate) ── */
const C = {
  ink: '#111827',
  cream: '#ffffff',
  page: '#f9fafb',
  text: '#374151',
  dim: '#6b7280',
  mute: '#9ca3af',
  border: '#e5e7eb',
  gold: '#fbbf24',
};

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Branded header: centered logo or wordmark. */
function header(): string {
  const logo = process.env.LOGO_URL;
  const brand = logo
    ? `<img src="${logo}" alt="Khalif Rooble" height="32" style="display:block;border:0;outline:none;">`
    : `<span style="font-family:${FONT};color:${C.ink};font-size:20px;font-weight:800;letter-spacing:1px;">KHALIF ROOBLE</span>`;
  return `
    <tr><td style="padding:40px 40px 10px;text-align:center;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td align="center">${brand}</td>
      </tr></table>
    </td></tr>`;
}

/** Wrap body content in a beautiful modern email shell. */
function shell(opts: { preheader: string; eyebrow: string; heading: string; body: string }): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background-color:${C.page};-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.page};padding:40px 20px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${C.cream};border:1px solid ${C.border};border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.04);overflow:hidden;">
          ${header()}
          <tr><td style="padding:20px 40px 40px;">
            <p style="font-family:${FONT};margin:0 0 10px;color:${C.dim};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;text-align:center;">${esc(opts.eyebrow)}</p>
            <h1 style="font-family:${FONT};margin:0 0 24px;color:${C.ink};font-size:26px;font-weight:700;letter-spacing:-0.02em;text-align:center;">${esc(opts.heading)}</h1>
            <div style="border-top:1px solid ${C.border};margin:24px 0;"></div>
            ${opts.body}
          </td></tr>
          <tr><td style="padding:24px 40px;background-color:#f3f4f6;border-top:1px solid ${C.border};text-align:center;">
            <p style="font-family:${FONT};margin:0;color:${C.mute};font-size:12px;">Sent securely from your portfolio &middot; khalifroble.com</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}

function quoteCard(text: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
    <tr><td style="background-color:#f9fafb;border:1px solid ${C.border};border-left:4px solid #2563eb;border-radius:8px;padding:20px;font-family:${FONT};color:${C.text};font-size:15px;line-height:1.6;font-style:italic;">"${esc(text)}"</td></tr>
  </table>`;
}

function button(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto 0;"><tr>
    <td style="background-color:#111827;border-radius:8px;text-align:center;">
      <a href="${href}" style="display:inline-block;padding:14px 32px;font-family:${FONT};color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">${esc(label)}</a>
    </td></tr></table>`;
}

export interface FeedbackMail {
  name: string;
  title?: string;
  company?: string;
  rating: number;
  message: string;
}

export function renderFeedbackEmail(f: FeedbackMail): string {
  const stars =
    `<span style="color:${C.gold};font-size:18px;letter-spacing:2px;">${'★'.repeat(f.rating)}</span>` +
    `<span style="color:#cfc8ba;font-size:18px;letter-spacing:2px;">${'☆'.repeat(5 - f.rating)}</span>` +
    `<span style="font-family:${FONT};color:${C.mute};font-size:13px;"> &nbsp;${f.rating}/5</span>`;
  const who = [f.title, f.company].filter(Boolean).join(' · ');

  const body = `
    <p style="margin:0 0 14px;">${stars}</p>
    <p style="font-family:${FONT};margin:0 0 2px;color:${C.text};font-size:16px;font-weight:600;">${esc(f.name)}</p>
    ${who ? `<p style="font-family:${FONT};margin:0 0 14px;color:${C.dim};font-size:13px;">${esc(who)}</p>` : ''}
    ${quoteCard(f.message)}`;

  return shell({
    preheader: `${f.rating}★ — "${f.message.slice(0, 80)}"`,
    eyebrow: 'New website review',
    heading: `${f.name} left a ${f.rating}-star review`,
    body,
  });
}

export async function notifyFeedback(f: FeedbackMail): Promise<void> {
  await getClient().emails.send({
    from: from(),
    to: to(),
    subject: `New review · ${f.rating}★ from ${f.name}`,
    html: renderFeedbackEmail(f),
  });
}

export interface LeadMail {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  need: string;
}

export function renderLeadEmail(l: LeadMail): string {
  const row = (label: string, value: string, href?: string) =>
    `<tr>
      <td style="font-family:${FONT};color:${C.mute};font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:4px 16px 4px 0;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="font-family:${FONT};color:${C.text};font-size:15px;padding:4px 0;">${
        href ? `<a href="${href}" style="color:${C.ink};text-decoration:none;border-bottom:1px solid ${C.border};">${esc(value)}</a>` : esc(value)
      }</td>
    </tr>`;

  const rows = [
    l.email && row('Email', l.email, `mailto:${l.email}`),
    l.phone && row('Phone', l.phone, `tel:${l.phone}`),
    l.company && row('Company', l.company),
  ]
    .filter(Boolean)
    .join('');

  const body = `
    <p style="font-family:${FONT};margin:0 0 14px;color:${C.text};font-size:18px;font-weight:600;">${esc(l.name)}</p>
    ${rows ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">${rows}</table>` : ''}
    <p style="font-family:${FONT};margin:0 0 4px;color:${C.mute};font-size:12px;text-transform:uppercase;letter-spacing:1px;">What they need</p>
    ${quoteCard(l.need)}
    ${l.email ? button(`Reply to ${l.name}`, `mailto:${l.email}`) : ''}`;

  return shell({
    preheader: `${l.name}: ${l.need.slice(0, 80)}`,
    eyebrow: 'New lead from the assistant',
    heading: `${l.name} wants to connect`,
    body,
  });
}

export async function notifyLead(l: LeadMail): Promise<void> {
  await getClient().emails.send({
    from: from(),
    to: to(),
    subject: `New lead · ${l.name}`,
    html: renderLeadEmail(l),
  });
}

/* ── Confirmation sent to the VISITOR who left their details ── */

export function renderThankYouEmail(l: LeadMail): string {
  const heart = `<span style="color:#e11d48;">&#9829;</span>`;
  const p = `font-family:${FONT};margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;`;

  // Edge-to-edge banner image at the top
  const bannerUrl = process.env.BANNER_URL || 'https://images.unsplash.com/photo-1554774853-719586f82d77?w=600&h=200&fit=crop';
  const head = `<tr><td style="padding:0;"><img src="${bannerUrl}" alt="" width="600" style="display:block;width:100%;max-width:600px;border:0;"></td></tr>`;

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background-color:#f5f5f5;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Thanks for reaching out — Khalif will reply within 24 hours.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 12px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e5e7eb;overflow:hidden;">
          ${head}
          <tr><td style="padding:40px 40px 10px;">
            <h1 style="font-family:${FONT};margin:0 0 30px;color:#111827;font-size:28px;font-weight:800;letter-spacing:-0.02em;">Thank you! ${heart}</h1>
            <p style="${p}">Hey ${esc(l.name)},</p>
            <p style="${p}">Thank you so much for reaching out through my portfolio. Whether you are looking for financial strategy, operational improvements, or just browsing, I genuinely appreciate you taking the time to connect.</p>
            <p style="${p}">I've received your message and I'll personally get back to you <strong>within 24 hours</strong> to see how we can work together.</p>
            <p style="${p}">Here's to an inspiring year ahead!</p>
          </td></tr>
          <tr><td style="padding:10px 40px 40px;">
            <div style="border-top:1px solid #f3f4f6;margin:20px 0;padding-top:20px;">
              <p style="font-family:${FONT};margin:0 0 8px;color:#111827;font-size:15px;font-weight:700;">See you soon!</p>
              <p style="font-family:${FONT};margin:0;color:#6b7280;font-size:14px;">Khalif Rooble</p>
            </div>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}

/** Best-effort confirmation to the visitor. No-op if no email was captured. */
export async function sendLeadConfirmation(l: LeadMail): Promise<void> {
  if (!l.email) return;
  await getClient().emails.send({
    from: from(),
    to: l.email,
    subject: 'Thanks for reaching out — Khalif will be in touch',
    html: renderThankYouEmail(l),
  });
}

/* ── Contact form message (footer) → Khalif ── */

export interface ContactMail {
  email: string;
  message: string;
}

export function renderContactEmail(c: ContactMail): string {
  const body = `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;"><tr>
      <td style="font-family:${FONT};color:${C.mute};font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:4px 16px 4px 0;white-space:nowrap;">From</td>
      <td style="font-family:${FONT};color:${C.text};font-size:15px;padding:4px 0;"><a href="mailto:${esc(c.email)}" style="color:${C.ink};text-decoration:none;border-bottom:1px solid ${C.border};">${esc(c.email)}</a></td>
    </tr></table>
    <p style="font-family:${FONT};margin:0 0 4px;color:${C.mute};font-size:12px;text-transform:uppercase;letter-spacing:1px;">Message</p>
    ${quoteCard(c.message)}
    ${button('Reply', `mailto:${c.email}`)}`;

  return shell({
    preheader: c.message.slice(0, 90),
    eyebrow: 'New contact message',
    heading: 'Someone messaged you from the site',
    body,
  });
}

export async function notifyContact(c: ContactMail): Promise<void> {
  await getClient().emails.send({
    from: from(),
    to: to(),
    replyTo: c.email,
    subject: `New message from ${c.email}`,
    html: renderContactEmail(c),
  });
}
