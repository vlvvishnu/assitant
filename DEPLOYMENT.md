# Flow Assistant deployment checklist

Use these settings for Cloudflare Pages:

- Framework preset: **Vite**
- Root directory: `/`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `20` or newer

Before deploying, make sure Cloudflare is building the branch that contains `package.json` at the repository root. If the build log checks out `1ca470f Initialize repository`, Cloudflare is deploying the initial commit instead of the app branch.

The repository includes:

- `wrangler.toml` with `pages_build_output_dir = "dist"`
- `public/_redirects` for React Router SPA fallback, including `/share`
- `public/_headers` for service-worker cache control
