# Frontend Setup and Configuration

← Back to the [frontend documentation index](README.md)

## Prerequisites

- Node.js 18.18 or newer. Next.js 15 requires at least that version.
- The backend API reachable at `http://127.0.0.1:8001`. See [Backend setup](https://github.com/maulik6359/FLAMORA_BACK/blob/main/docs/setup-and-configuration.md).

## Installation

```bash
npm install          # or: yarn install (both package-lock.json and yarn.lock are committed)
```

## Scripts (`package.json`)

| Script | Command | Purpose |
| --- | --- | --- |
| `npm start` | `next dev -H 0.0.0.0 -p 3000` | **Development** server with hot reload. In this project, `start` runs the dev server, not production. |
| `npm run build` | `next build` | Production build into `.next/` |
| `npm run prod` | `next start -H 0.0.0.0 -p 3000` | Serves the production build |
| `npm run lint` | `next lint` | ESLint through Next.js. No ESLint config file is committed. |

There's no test script.

## Environment variables

`.env` defines three variables:

| Variable | Value in repo | Read by code? | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `/api` | **Yes**: `lib/api.ts` (falls back to `/api`) and `lib/api/axios.ts` (falls back to `http://localhost:5000/api/v1`) | Base URL for browser API calls. Inlined into the client bundle at build time. |
| `API_URL` | `http://127.0.0.1:8001/api` | **No** | Not referenced anywhere. The server-side fetches in `app/(shop)/page.tsx` hard-code `http://127.0.0.1:8001/api`. |
| `NEXT_PUBLIC_SITE_NAME` | `FLAMORA` | **No** | Not referenced. The brand name is hard-coded in components. |
| `API_INTERNAL_URL` | not set | **Yes** (optional): `lib/catalog.ts`, `lib/currency.ts` | Backend base URL for **server-side** fetches (catalogue on server-rendered pages, store currency in the root layout). Defaults to `http://127.0.0.1:8001`. |

`process.env.NODE_ENV` decides whether `<Analytics />` (Vercel Web Analytics) is rendered. It's rendered only in production.

`NEXT_PUBLIC_*` values are embedded at **build time**. Changing them requires a rebuild.

## `next.config.mjs`

```js
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true, remotePatterns: [{ protocol: "https", hostname: "**" }] },
  experimental: { serverActions: { allowedOrigins: ["*"] } },
  async rewrites() {
    return [{ source: "/api/:path*", destination: "http://127.0.0.1:8001/api/:path*" }];
  },
};
```

| Setting | Effect |
| --- | --- |
| `rewrites` | Every `/api/*` request to the Next.js server is proxied to the backend on `127.0.0.1:8001`. This is why browser code can call relative `/api/...` URLs. **The backend host and port are hard-coded here.** |
| `images.unoptimized` | `next/image` serves the original files with no optimization pipeline |
| `images.remotePatterns` | Allows any HTTPS image host |
| `eslint.ignoreDuringBuilds`, `typescript.ignoreBuildErrors` | Lint and type errors don't fail `next build` |
| `experimental.serverActions.allowedOrigins: ["*"]` | Server Actions accept any origin. The app doesn't define any Server Actions. |
| `reactStrictMode` | React strict mode. Effects run twice in development. |

## TypeScript (`tsconfig.json`)

- `strict: false`, `allowJs: true`, `moduleResolution: "bundler"`, `jsx: "preserve"`.
- Path alias: `"@/*": ["./*"]`.

## Styling configuration

| File | Content |
| --- | --- |
| `postcss.config.js` | `@tailwindcss/postcss` + `autoprefixer` |
| `tailwind.config.js` | Brand colours, font families and shadows. Loaded from `globals.css` with `@config`. `darkMode: "class"`. |
| `app/globals.css` | Tailwind v4 imports, `@theme inline` tokens, base layer and custom `@utility` classes |

## Build

```bash
npm run build
npm run prod          # serves on 0.0.0.0:3000
```

Before you build, keep in mind:

- The [route conflict on `/`](known-issues.md#1-two-pages-resolve-to-) has to be fixed before the build will finish.
- `app/(shop)/page.tsx` is marked `force-dynamic`, and at request time it fetches from `http://127.0.0.1:8001`. That only works when the backend runs on the same host.

## Deployment

The repository includes `@vercel/analytics` and `.gitignore` entries for `.vercel/`, which suggests Vercel hosting. However, no `vercel.json`, Dockerfile or CI configuration is committed, so the actual deployment target can't be confirmed from the code. Because the rewrite target is hard-coded to `127.0.0.1:8001`, you'll need one of these for a deployment where the API runs on a different host:

- run the frontend and backend on the same machine or container, or
- change the rewrite destination, or
- point `NEXT_PUBLIC_API_URL` at the public API URL and add the frontend's origin to the backend's `FRONTEND_URL` (its CORS allow-list), and set `API_INTERNAL_URL` for server-side fetches.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Every API call fails with 500 or `ECONNREFUSED` in the Next.js log | The backend isn't listening on `127.0.0.1:8001` |
| `/` fails with a "two parallel pages" error | The [route conflict](known-issues.md#1-two-pages-resolve-to-) |
| You're redirected to `/admin/login` despite being signed in | The `flamora_token` cookie is missing or expired (7-day max-age), even though `localStorage` still holds a token. Sign in again. |
| Admin Brands, Collections, Materials or Gemstones lists are empty, or the console shows a JSON parse error | [Known issue 4](known-issues.md#4-admin-pages-for-brands-collections-materials-and-gemstones-cant-load-their-lists) |
