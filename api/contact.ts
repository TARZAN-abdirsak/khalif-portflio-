/**
 * POST /api/contact
 * Body: { email: string, message: string }
 * Saves the message to Firestore and emails Khalif (best-effort).
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_lib/firebase';
import { notifyContact } from './_lib/resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 4000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const email = typeof body.email === 'string' ? body.email.trim().slice(0, 160) : '';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, MAX_MESSAGE) : '';

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email.' });
    }
    if (!message) {
      return res.status(400).json({ error: 'Please add a short message.' });
    }

    const now = Date.now();
    await getDb().collection('messages').add({
      email,
      message,
      createdAt: now,
      date: new Date(now).toISOString(),
    });

    // Email is best-effort — never fail the submission on a mail error.
    try {
      await notifyContact({ email, message });
    } catch (err) {
      console.error('notifyContact failed:', err);
    }

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('contact handler error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
