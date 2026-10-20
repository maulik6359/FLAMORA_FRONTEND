# Getting Started (Frontend)

This guide gets the storefront and admin console running locally against the FLAMORA API.

← Back to the [frontend documentation index](README.md)

## Prerequisites

| Requirement | Notes |
| --- | --- |
| Node.js 18.18 or newer | Required by Next.js 15 |
| npm or Yarn | Both `package-lock.json` and `yarn.lock` are committed, and the code doesn't say which one is canonical. The commands below use npm. |
| The FLAMORA API | Clone [FLAMORA_BACK](https://github.com/maulik6359/FLAMORA_BACK) and follow its getting-started guide. It needs MongoDB. The API must listen on `127.0.0.1:8001`. |

A side-by-side checkout works well:

```text
flamora/
├── FLAMORA_FRONTEND/   ← this repository
└── FLAMORA_BACK/       ← the API
```

## 1. Start the API

In the backend repository:

```bash
npm install
npm start                                  # node server.js
curl http://localhost:8001/api/health      # {"status":"ok","service":"flamora-api"}
```

The backend seeds an admin user, five categories, nine products and two payment methods on first boot.

## 2. Configure and start the frontend

```bash
npm install
```

`.env` contains:

```dotenv
NEXT_PUBLIC_API_URL="/api"
API_URL="http://127.0.0.1:8001/api"
NEXT_PUBLIC_SITE_NAME="FLAMORA"
```

Only `NEXT_PUBLIC_API_URL` is read by the code. See [Setup and configuration](setup-and-configuration.md#environment-variables).

Start the dev server:

```bash
npm start        # runs: next dev -H 0.0.0.0 -p 3000
```

Open `http://localhost:3000`. Requests to `http://localhost:3000/api/*` are rewritten to `http://127.0.0.1:8001/api/*` (hard-coded in [`next.config.mjs`](../next.config.mjs)), so the API must listen on port **8001**.

> **Heads-up:** `app/page.tsx` and `app/(shop)/page.tsx` both resolve to `/`. Next.js doesn't allow two pages at the same path, so expect an error on `/` until one of them is removed. See [Known issues](known-issues.md#1-two-pages-resolve-to-).

## 3. Sign in to the admin console

1. Go to `http://localhost:3000/admin/login`.
2. Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` the backend seeded from its `.env`.
3. You land on `/admin/dashboard`.

To create a customer account, use `/auth/register`.

## Next steps

- Read the [architecture](architecture.md) and [API integration](api-integration.md) guides.
- Read [Known issues](known-issues.md) before changing checkout or catalogue code.
