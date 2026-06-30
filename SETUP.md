# Backend setup — Firebase + Resend + Gemini on Vercel

The portfolio is a static Vite app **plus** three serverless functions in [`/api`](api):

| Endpoint | What it does |
| --- | --- |
| `GET /api/feedback` | Returns published reviews from Firestore |
| `POST /api/feedback` | Saves a review (auto-published) + emails Khalif (Resend) |
| `POST /api/chat` | Gemini assistant (Khalif-only topics) + saves leads → Firestore + email |

All secret keys live in **server-side env vars** only — the browser never sees them.

You need accounts on: **Firebase** (free), **Resend** (free tier), **Google AI Studio / Gemini** (free tier), and **Vercel**.

---

## 1. Firebase (Firestore database)

1. Go to <https://console.firebase.google.com> → **Add project** (e.g. `khalif-portfolio`).
2. Left menu → **Build → Firestore Database → Create database** → start in **Production mode** → pick a region.
3. Because all reads/writes go through the Admin SDK on the server, lock the client down.
   Firestore → **Rules** → set and **Publish**:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} { allow read, write: if false; }
     }
   }
   ```
   (The Admin SDK bypasses these rules; this just blocks direct browser access.)
4. Project **Settings (gear) → Service accounts → Generate new private key** → downloads a JSON file.
   From that JSON take three values:
   - `project_id`   → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key`  → `FIREBASE_PRIVATE_KEY` (keep the `\n` sequences, wrap in quotes)

> Collections `feedback` and `leads` are created automatically on first write — nothing to set up.

## 2. Resend (email)

1. Sign up at <https://resend.com> → **API Keys → Create** → copy into `RESEND_API_KEY`.
2. **Domains → Add domain** → add your domain and the DNS records it shows (you said you have a real domain).
   Once verified, set `RESEND_FROM` to something like `"Khalif Rooble <hello@yourdomain.com>"`.
3. Set `NOTIFY_EMAIL` to the inbox where Khalif should receive reviews and leads.

## 3. Gemini (AI assistant)

1. Go to <https://aistudio.google.com/app/apikey> → **Create API key** → copy into `GEMINI_API_KEY`.
2. Leave `GEMINI_MODEL` as `gemini-2.0-flash` (default) unless you want a different model.

## 4. Vercel (hosting + functions + env vars)

1. <https://vercel.com/new> → **Import** the GitHub repo `khalif-portflio-`.
2. Framework preset auto-detects **Vite** (build `npm run build`, output `dist`) — already pinned in [`vercel.json`](vercel.json).
3. Before/after the first deploy, open **Settings → Environment Variables** and add every key from
   [`.env.example`](.env.example) (Production + Preview):
   `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `RESEND_API_KEY`,
   `RESEND_FROM`, `NOTIFY_EMAIL`, `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`).
4. **Redeploy** so the functions pick up the env vars.

Every `git push` to `main` redeploys automatically.

---

## Local development

`npm run dev` (plain Vite) serves the UI but **not** the `/api` functions — the chat and feedback
calls will fail and the feedback section falls back to the seed reviews. To run the functions locally:

```bash
npm i -g vercel      # once
cp .env.example .env # then fill in real values
vercel dev           # serves the app AND /api on one port
```

## Notes

- **Feedback auto-publishes** (your choice). To remove a bad review, delete the document in the
  Firestore console (collection `feedback`). Ask if you later want an admin-protected delete in the UI.
- **Leads** captured by the assistant land in the `leads` collection and are emailed to `NOTIFY_EMAIL`.
- The assistant only answers questions about Khalif; its knowledge lives in
  [`api/_lib/knowledge.ts`](api/_lib/knowledge.ts) — edit that file to update what it knows.
