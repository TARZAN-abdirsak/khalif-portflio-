/**
 * GET  /api/feedback  → published reviews, newest first.
 * POST /api/feedback  → add a review (auto-published), emails Khalif (best-effort).
 *
 * All Firebase access is server-side; the browser never sees Firebase config.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_lib/firebase.js';
import { notifyFeedback } from './_lib/resend.js';

const COLLECTION = 'feedback';
const MAX_MESSAGE = 2000;
const MAX_IMAGE = 200_000; // ~150KB data URL cap

interface Review {
  id: string;
  name: string;
  title: string;
  company?: string;
  rating: number;
  message: string;
  image?: string;
  date: string;
}

function clean(s: unknown, max = 200): string {
  return typeof s === 'string' ? s.trim().slice(0, max) : '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = getDb();

    if (req.method === 'GET') {
      const snap = await db
        .collection(COLLECTION)
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get();
      const items: Review[] = snap.docs.map((d) => {
        const v = d.data();
        return {
          id: d.id,
          name: v.name,
          title: v.title ?? '',
          company: v.company || undefined,
          rating: v.rating,
          message: v.message,
          image: v.image || undefined,
          date: v.date,
        };
      });
      return res.status(200).json({ items });
    }

    if (req.method === 'POST') {
      const body = (req.body ?? {}) as Record<string, unknown>;
      const name = clean(body.name, 80);
      const message = clean(body.message, MAX_MESSAGE);
      const title = clean(body.title, 80);
      const company = clean(body.company, 80);
      const ratingNum = Number(body.rating);
      const image = typeof body.image === 'string' ? body.image : '';

      if (!name || !message) {
        return res.status(400).json({ error: 'Name and message are required.' });
      }
      if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ error: 'Rating must be 1–5.' });
      }
      if (image && image.length > MAX_IMAGE) {
        return res.status(400).json({ error: 'Image is too large.' });
      }

      const now = Date.now();
      const doc = {
        name,
        title,
        company: company || null,
        rating: ratingNum,
        message,
        image: image || null,
        published: true,
        createdAt: now,
        date: new Date(now).toISOString(),
      };
      const ref = await db.collection(COLLECTION).add(doc);

      // Email is best-effort — never fail the submission on a mail error.
      try {
        await notifyFeedback({ name, title, company, rating: ratingNum, message });
      } catch (err) {
        console.error('notifyFeedback failed:', err);
      }

      const created: Review = {
        id: ref.id,
        name,
        title,
        company: company || undefined,
        rating: ratingNum,
        message,
        image: image || undefined,
        date: doc.date,
      };
      return res.status(201).json({ item: created });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err) {
    console.error('feedback handler error:', err);
    return res.status(500).json({ error: 'Server error. Check API configuration.' });
  }
}
