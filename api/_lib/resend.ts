/**
 * Resend email helpers. Both notifications are best-effort: callers should
 * wrap them so a mail failure never blocks the primary action (saving data).
 * Env: RESEND_API_KEY, RESEND_FROM (verified domain sender), NOTIFY_EMAIL.
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

export interface FeedbackMail {
  name: string;
  title?: string;
  company?: string;
  rating: number;
  message: string;
}

export async function notifyFeedback(f: FeedbackMail): Promise<void> {
  const stars = '★'.repeat(f.rating) + '☆'.repeat(5 - f.rating);
  const who = [f.title, f.company].filter(Boolean).join(' · ');
  await getClient().emails.send({
    from: from(),
    to: to(),
    subject: `New review · ${f.rating}★ from ${f.name}`,
    html: `
      <h2 style="margin:0 0 4px">New website review</h2>
      <p style="margin:0 0 12px;color:#666">${stars} (${f.rating}/5)</p>
      <p style="margin:0"><strong>${esc(f.name)}</strong>${who ? ` — ${esc(who)}` : ''}</p>
      <blockquote style="margin:12px 0;padding:12px 16px;border-left:3px solid #ddd;background:#faf9f6">
        ${esc(f.message)}
      </blockquote>
    `,
  });
}

export interface LeadMail {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  need: string;
}

export async function notifyLead(l: LeadMail): Promise<void> {
  const contact = [
    l.email && `Email: ${esc(l.email)}`,
    l.phone && `Phone: ${esc(l.phone)}`,
    l.company && `Company: ${esc(l.company)}`,
  ]
    .filter(Boolean)
    .join('<br>');
  await getClient().emails.send({
    from: from(),
    to: to(),
    subject: `New lead · ${l.name}`,
    html: `
      <h2 style="margin:0 0 8px">New lead from the assistant</h2>
      <p style="margin:0 0 8px"><strong>${esc(l.name)}</strong></p>
      ${contact ? `<p style="margin:0 0 12px;color:#444">${contact}</p>` : ''}
      <p style="margin:0 0 4px;color:#666">What they need:</p>
      <blockquote style="margin:0;padding:12px 16px;border-left:3px solid #ddd;background:#faf9f6">
        ${esc(l.need)}
      </blockquote>
    `,
  });
}
