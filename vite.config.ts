import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dev-only: run the Vercel `/api/*` serverless functions inside the Vite dev
 * server, so `npm run dev` exercises the real backend (Firestore, Gemini,
 * Resend) using values from `.env`. In production Vercel runs these functions
 * itself, so this plugin does nothing there (apply: 'serve').
 */
function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      // Load .env (all keys, no prefix) into process.env for the handlers.
      const env = loadEnv('development', process.cwd(), '');
      for (const [k, v] of Object.entries(env)) {
        if (process.env[k] === undefined) process.env[k] = v;
      }

      // Added directly here → runs BEFORE Vite's internal middlewares,
      // so /api/* is intercepted instead of being served as a .ts module.
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next();

        const path = req.url.split('?')[0].replace(/\/+$/, '');
        const modPath = `.${path}.ts`; // e.g. ./api/chat.ts

        try {
          const mod = await server.ssrLoadModule(modPath);
          const handler = mod.default;
          if (typeof handler !== 'function') return next();

          // Parse JSON body for non-GET requests.
          let body: unknown = undefined;
          if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
            const chunks: Buffer[] = [];
            for await (const c of req) chunks.push(c as Buffer);
            const raw = Buffer.concat(chunks).toString('utf8');
            body = raw ? JSON.parse(raw) : {};
          }

          // Minimal Vercel-compatible req/res shim.
          const vreq = Object.assign(req, { body, query: {} });
          const vres = Object.assign(res, {
            status(code: number) {
              res.statusCode = code;
              return vres;
            },
            json(obj: unknown) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(obj));
              return vres;
            },
            send(data: unknown) {
              res.end(typeof data === 'string' ? data : JSON.stringify(data));
              return vres;
            },
          });

          await handler(vreq, vres);
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          console.error('[dev-api]', message);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `dev-api: ${message}` }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devApi()],
  server: {
    port: 5173,
    open: false,
    host: true,
  },
});
