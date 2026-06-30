/**
 * POST /api/chat
 * Body: { messages: { role: 'user' | 'model'; text: string }[] }  (last must be 'user')
 * Returns: { reply: string, leadSaved: boolean }
 *
 * Gemini customer-care assistant scoped to Khalif. When it gathers a name,
 * a contact method, and a need, it calls save_lead → Firestore + email.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  GoogleGenerativeAI,
  SchemaType,
  type Content,
  type FunctionDeclaration,
  type Part,
} from '@google/generative-ai';
import { SYSTEM_PROMPT } from './_lib/knowledge';
import { getDb } from './_lib/firebase';
import { notifyLead, sendLeadConfirmation } from './_lib/resend';

const MAX_MESSAGES = 24;
const MAX_TEXT = 4000;

const SAVE_LEAD: FunctionDeclaration = {
  name: 'save_lead',
  description:
    'Save a potential client lead. Call only when the visitor has shared their name, at least ' +
    'one contact method (email or phone), and a short note on what they need.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      name: { type: SchemaType.STRING, description: "The visitor's name" },
      email: { type: SchemaType.STRING, description: "The visitor's email, if provided" },
      phone: { type: SchemaType.STRING, description: "The visitor's phone, if provided" },
      company: { type: SchemaType.STRING, description: "The visitor's company, if provided" },
      need: { type: SchemaType.STRING, description: 'What the visitor needs or is asking about' },
    },
    required: ['name', 'need'],
  },
};

interface LeadArgs {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  need?: string;
}

async function saveLead(args: LeadArgs): Promise<{ ok: boolean }> {
  const name = (args.name ?? '').trim().slice(0, 120);
  const need = (args.need ?? '').trim().slice(0, 2000);
  if (!name || !need) return { ok: false };

  const lead = {
    name,
    email: (args.email ?? '').trim().slice(0, 160) || null,
    phone: (args.phone ?? '').trim().slice(0, 60) || null,
    company: (args.company ?? '').trim().slice(0, 120) || null,
    need,
    createdAt: Date.now(),
    date: new Date().toISOString(),
  };

  try {
    await getDb().collection('leads').add(lead);
  } catch (err) {
    console.error('save lead to Firestore failed:', err);
    return { ok: false };
  }

  try {
    await notifyLead({
      name,
      email: lead.email ?? undefined,
      phone: lead.phone ?? undefined,
      company: lead.company ?? undefined,
      need,
    });
  } catch (err) {
    console.error('notifyLead failed:', err);
  }

  // Confirmation to the visitor (best-effort; no-op without an email).
  try {
    await sendLeadConfirmation({
      name,
      email: lead.email ?? undefined,
      phone: lead.phone ?? undefined,
      company: lead.company ?? undefined,
      need,
    });
  } catch (err) {
    console.error('sendLeadConfirmation failed:', err);
  }

  return { ok: true };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
  }

  try {
    const raw = ((req.body ?? {}) as { messages?: unknown }).messages;
    if (!Array.isArray(raw) || raw.length === 0) {
      return res.status(400).json({ error: 'messages array is required.' });
    }

    // Normalize, clamp length, keep only valid roles.
    let msgs = raw
      .map((m) => m as { role?: string; text?: string })
      .filter((m) => (m.role === 'user' || m.role === 'model') && typeof m.text === 'string')
      .map((m) => ({ role: m.role as 'user' | 'model', text: m.text!.slice(0, MAX_TEXT) }))
      .slice(-MAX_MESSAGES);

    // Gemini history must start with a 'user' turn.
    while (msgs.length && msgs[0].role !== 'user') msgs.shift();
    if (!msgs.length || msgs[msgs.length - 1].role !== 'user') {
      return res.status(400).json({ error: 'Last message must be from the user.' });
    }

    const latest = msgs[msgs.length - 1].text;
    const history: Content[] = msgs
      .slice(0, -1)
      .map((m) => ({ role: m.role, parts: [{ text: m.text }] }));

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ functionDeclarations: [SAVE_LEAD] }],
    });

    const chat = model.startChat({ history });
    let result = await chat.sendMessage(latest);
    let leadSaved = false;

    // Resolve any function calls (bounded loop).
    for (let i = 0; i < 3; i++) {
      const calls = result.response.functionCalls();
      if (!calls || calls.length === 0) break;
      const parts: Part[] = [];
      for (const call of calls) {
        let out: { ok: boolean } = { ok: false };
        if (call.name === 'save_lead') {
          out = await saveLead(call.args as LeadArgs);
          if (out.ok) leadSaved = true;
        }
        parts.push({ functionResponse: { name: call.name, response: out } });
      }
      result = await chat.sendMessage(parts);
    }

    const reply =
      result.response.text().trim() ||
      "Sorry, I didn't catch that — could you rephrase?";
    return res.status(200).json({ reply, leadSaved });
  } catch (err) {
    console.error('chat handler error:', err);
    return res.status(500).json({ error: 'Assistant is unavailable right now.' });
  }
}
