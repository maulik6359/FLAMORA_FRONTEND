# FLAMORA Frontend Documentation

The frontend, published as `flamora-frontend` v1.0.0, is a Next.js App Router application. It has two faces:

- **Storefront**: the public luxury jewellery shop, covering home, shop, product pages, collections, cart, wishlist, checkout, account and content pages.
- **Admin console** (`/admin/*`): a dark-themed back office for catalogue, inventory, orders, customers, content, engagement, metrics and configuration.

## Documentation index

| Document | What it covers |
| --- | --- |
| [Getting started](getting-started.md) | Running the frontend locally against the API |
| [Architecture](architecture.md) | Folder structure, route groups, entry points, rendering model, styling |
| [Setup and configuration](setup-and-configuration.md) | Installation, environment variables, scripts, `next.config.mjs`, build and deployment |
| [Pages, components and routing](components-and-routing.md) | Every route, layouts, the admin middleware, component catalogue |
| [State management and data flow](state-management.md) | Zustand stores, persistence, the API product catalogue |
| [API integration](api-integration.md) | API clients, which pages call which endpoints, auth and checkout flows |
| [Forms, validation and utilities](forms-validation-and-utilities.md) | Form handling, client-side validation, notifications, helper modules |
| [Known issues](known-issues.md) | Frontend problems and frontend–backend mismatches found while documenting |

## System context

FLAMORA is split across two repositories:

| Part | Repository | Stack | Default port |
| --- | --- | --- | --- |
| Storefront + admin console | **this repository** ([FLAMORA_FRONTEND](https://github.com/maulik6359/FLAMORA_FRONTEND)) | Next.js 15, React 18, TypeScript, Tailwind CSS 4, Zustand | `3000` |
| REST API | [FLAMORA_BACK](https://github.com/maulik6359/FLAMORA_BACK) | Node.js, Express 4, Mongoose 8 (MongoDB), JWT, Razorpay | `8001` |

The frontend proxies every `/api/*` request to the backend through a Next.js rewrite, so in development the browser only talks to `http://localhost:3000`.

```text
Browser ──► Next.js (3000) ──/api/* rewrite──► Express API (8001) ──► MongoDB
                                                     │
                                                     └──► Razorpay REST API (payments)
```

Backend documentation, including the full API reference, lives in the backend repository's [`docs/` folder](https://github.com/maulik6359/FLAMORA_BACK/blob/main/docs/README.md). That repository is private, so the link only works for collaborators.

## Technology stack

| Concern | Library | Version range (`package.json`) |
| --- | --- | --- |
| Framework | `next` | `^15.0.3` (15.5.x installed) |
| UI library | `react`, `react-dom` | `^18.3.1` |
| Language | TypeScript | `^5.6.3` (`strict: false`) |
| Styling | `tailwindcss` v4 + `@tailwindcss/postcss`, `tw-animate-css`, `autoprefixer` | `^4.3.3` |
| Class utilities | `clsx`, `tailwind-merge` | |
| State management | `zustand` (with `persist` middleware) | `^5.0.1` |
| Animation | `framer-motion` | `^11.11.10` |
| Smooth scrolling | `lenis` | `^1.3.25` (installed, no longer imported) |
| 3D | `three`, `@react-three/fiber` | `^0.186.1`, `^8.17.10` |
| Charts | `recharts` | `^3.9.2` (admin analytics) |
| Notifications | `sonner` | `^1.7.0` |
| Icons | `lucide-react` | `^0.454.0` |
| HTTP | `fetch` (`lib/api.ts`, `lib/catalog.ts`). `axios` is installed but no longer imported. | `axios ^1.20.0` |
| Analytics | `@vercel/analytics` | `^2.0.1` (production builds only) |
| Fonts | `next/font/google`: Playfair Display, Jost | |
| Installed but unused | `react-hook-form`, `@hookform/resolvers`, `zod`, `js-cookie` | No imports found in the source |

## Quick start

```bash
npm install
npm start              # next dev on http://0.0.0.0:3000
```

The backend must be running on `127.0.0.1:8001` for API calls to work. See [Getting started](getting-started.md).

## Feature summary

| Area | Data source | Notes |
| --- | --- | --- |
| Home (`/`) | Static content (`app/page.tsx`) | Cinematic landing page with video, 3D and editorial sections |
| Shop, search, product detail, collections, wishlist | API `/api/products` (through `lib/catalog.ts`) | Client-side filtering and sorting of the loaded catalogue |
| Cart, wishlist | Zustand stores persisted to `localStorage` | For signed-in customers the wishlist syncs with the account (`/api/wishlist`); signing out clears both from the device |
| Auth (login, register) | API `/api/auth/*` | JWT stored in Zustand and mirrored into cookies |
| Checkout | API `/api/orders/quote`, `/api/orders`, `/api/payments/*`, `/api/payment-methods` | Coupon, shipping choice and server-quoted totals; Razorpay modal or Cash on Delivery |
| Account | API `/api/orders/mine` | Shows profile basics and order history |
| Admin console | API `/api/admin/*` | 35 pages, most built on a generic `CrudAdmin` component |
