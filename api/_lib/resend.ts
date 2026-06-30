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

/* ── Brand palette (mirrors the site) ── */
const C = {
  ink: '#161410',
  cream: '#fbf9f4',
  page: '#eceae5',
  text: '#161410',
  dim: '#5e584e',
  mute: '#938b7e',
  border: '#e6e1d6',
  gold: '#c08a2e',
};

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/** Branded header: logo image if LOGO_URL is set, otherwise the wordmark. */
function header(): string {
  const logo = process.env.LOGO_URL;
  const brand = logo
    ? `<img src="${logo}" alt="Khalif Rooble" height="28" style="display:block;border:0;outline:none;">`
    : `<span style="font-family:${FONT};color:${C.cream};font-size:16px;font-weight:700;letter-spacing:3px;">KHALIF&nbsp;ROOBLE</span>`;
  return `
    <tr><td style="background:${C.ink};padding:22px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td align="left">${brand}</td>
        <td align="right" style="font-family:${FONT};color:${C.mute};font-size:11px;letter-spacing:2px;text-transform:uppercase;">Financial&nbsp;Strategy&nbsp;Advisor</td>
      </tr></table>
    </td></tr>`;
}

/** Wrap body content in the branded email shell. */
function shell(opts: { preheader: string; eyebrow: string; heading: string; body: string }): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:${C.page};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};padding:28px 12px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${C.cream};border:1px solid ${C.border};border-radius:16px;overflow:hidden;">
          ${header()}
          <tr><td style="padding:32px 32px 8px;">
            <p style="font-family:${FONT};margin:0 0 6px;color:${C.mute};font-size:11px;letter-spacing:2px;text-transform:uppercase;">${esc(opts.eyebrow)}</p>
            <h1 style="font-family:${FONT};margin:0 0 20px;color:${C.text};font-size:22px;font-weight:600;letter-spacing:-0.01em;">${esc(opts.heading)}</h1>
            ${opts.body}
          </td></tr>
          <tr><td style="padding:18px 32px;border-top:1px solid ${C.border};background:#f0ede6;">
            <p style="font-family:${FONT};margin:0;color:${C.mute};font-size:12px;">Sent automatically from your portfolio at khalifroble.com</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}

function quoteCard(text: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 8px;">
    <tr><td style="background:#ffffff;border:1px solid ${C.border};border-left:3px solid ${C.ink};border-radius:10px;padding:16px 18px;font-family:${FONT};color:${C.text};font-size:15px;line-height:1.6;">${esc(text)}</td></tr>
  </table>`;
}

function button(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px 0 6px;"><tr>
    <td style="background:${C.ink};border-radius:999px;">
      <a href="${href}" style="display:inline-block;padding:11px 24px;font-family:${FONT};color:${C.cream};font-size:14px;font-weight:600;text-decoration:none;">${esc(label)}</a>
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
  const heart = `<span style="color:${C.gold};">&#9829;</span>`;
  const p = `font-family:${FONT};margin:0 0 16px;color:${C.text};font-size:16px;line-height:1.65;`;

  // Warm header: banner image > logo > wordmark.
  const head = process.env.BANNER_URL
    ? `<tr><td><img src="${process.env.BANNER_URL}" alt="" width="600" style="display:block;width:100%;max-width:600px;border:0;"></td></tr>`
    : `<tr><td align="center" style="background:#f3ede1;padding:34px 32px 30px;">
        ${
          process.env.LOGO_URL
            ? `<img src="${process.env.LOGO_URL}" alt="Khalif Rooble" height="32" style="display:block;border:0;margin:0 auto;">`
            : `<span style="font-family:${FONT};color:${C.ink};font-size:17px;font-weight:700;letter-spacing:4px;">KHALIF&nbsp;ROOBLE</span>`
        }
        <p style="font-family:${FONT};margin:10px 0 0;color:${C.mute};font-size:11px;letter-spacing:2px;text-transform:uppercase;">Financial Strategy Advisor</p>
      </td></tr>`;

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:${C.page};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Thanks for reaching out — Khalif will reply within 24 hours.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${C.cream};border:1px solid ${C.border};border-radius:18px;overflow:hidden;">
          ${head}
          <tr><td style="padding:38px 40px 4px;">
            <h1 style="font-family:${FONT};margin:0 0 22px;color:${C.text};font-size:30px;font-weight:700;letter-spacing:-0.02em;">Thank you, ${esc(l.name)} ${heart}</h1>
            <p style="${p}">Thank you so much for reaching out through khalifroble.com — it genuinely means a lot.</p>
            <p style="${p}">I've received your message and I'll personally get back to you <strong>within 24 hours</strong>. Here's what you shared with me:</p>
            ${quoteCard(l.need)}
            <p style="${p}margin-top:22px;">Looking forward to connecting and seeing how I can help.</p>
          </td></tr>
          <tr><td style="padding:4px 40px 36px;">
            <p style="font-family:${FONT};margin:0;color:${C.text};font-size:16px;line-height:1.6;">Warm regards,<br><strong>Khalif Rooble</strong><br><span style="color:${C.mute};font-size:13px;">Financial Strategy Advisor</span></p>
          </td></tr>
          <tr><td style="padding:18px 40px;border-top:1px solid ${C.border};background:#f0ede6;">
            <p style="font-family:${FONT};margin:0;color:${C.mute};font-size:12px;">khalifroble.com · This is an automated confirmation of your message.</p>
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
