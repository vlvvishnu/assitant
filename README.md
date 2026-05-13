# Flow Assistant

Flow Assistant is an Android-first Progressive Web App for receiving shared content from WhatsApp, Gallery, Chrome, Gmail, Files, and other Android apps, then running configurable workflow automations.

## Highlights

- React + Vite + TypeScript + Tailwind CSS.
- Installable PWA with `vite-plugin-pwa`.
- Android Web Share Target API for `text/plain`, URLs, `image/*`, `application/pdf`, and multiple attachments.
- `/share` route with preview, local IndexedDB persistence, and matching workflow execution.
- Configurable `Trigger → Workflow → Actions` engine.
- Plugin-based integration registry for Gmail, Slack, OCR, AI summary, webhooks, uploads, and notes.
- Tesseract.js OCR adapter for images, with PDF OCR queued for a pdf.js/server-side rasterization adapter.
- Offline queue and local caching.
- Supabase schema with RLS for users, integrations, workflows, workflow actions, templates, history, and attachments.

## Local development

```bash
npm install
npm run dev
```

Create `.env.local` when connecting Supabase:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Production build

```bash
npm run build
npm run preview
```

Deploy the `dist/` directory over HTTPS. Android Web Share Target only works for installed PWAs on secure origins.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Create a private Storage bucket named `attachments`.
4. Configure OAuth or edge functions for Gmail/OpenAI secrets; never expose privileged service keys in the browser.

## Android install and share test

1. Open the deployed HTTPS URL in Chrome on Android.
2. Tap Chrome menu → **Add to Home Screen** / **Install app**.
3. Open WhatsApp, Gallery, Chrome, Gmail, or Files.
4. Share text, links, images, or PDFs to **Flow Assistant**.
5. Confirm `/share` previews content and offers matching workflows.

## Architecture

- PWA manifest and share target are configured in `vite.config.ts`.
- The custom service worker in `src/sw.ts` captures Android POST shares and writes them to IndexedDB before redirecting to `/share`.
- `src/services/workflows/engine.ts` matches triggers and executes ordered workflow actions.
- `src/services/integrations/registry.ts` is the extension point for Gmail, Slack, OCR, AI, webhooks, upload, and future plugins.

## Cloudflare Pages deployment

This repository is configured for Cloudflare Pages with `wrangler.toml` at the repository root.

Use these Pages settings:

- **Root directory:** `/`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** 20 or newer

If a Cloudflare build log says `Could not read package.json` and shows `HEAD is now at 1ca470f Initialize repository`, the deployment is building the initial/base commit instead of the branch that contains this app. Reconnect the Pages project to the PR branch or merge this branch before deploying.
