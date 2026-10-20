# Frontend Architecture

← Back to the [frontend documentation index](README.md)

## Folder structure

```text
frontend/
├── app/                          Next.js App Router
│   ├── layout.tsx                Root layout: fonts, globals.css, <Toaster>, Vercel Analytics
│   ├── page.tsx                  "/" cinematic landing page (client component)
│   ├── globals.css               Tailwind v4 entry, theme tokens, utility classes
│   ├── three/page.tsx            "/three" Three.js showcase (outside both route groups)
│   ├── (shop)/                   Storefront route group: AnnouncementBar + Navbar + CartDrawer + Footer
│   │   ├── layout.tsx
│   │   ├── page.tsx              "/" API-driven home page (conflicts with app/page.tsx)
│   │   ├── shop/ search/ product/[slug]/ collections/ collections/[slug]/
│   │   ├── cart/ wishlist/ checkout/ checkout/success/
│   │   ├── auth/login/ auth/register/ login/ (redirect) account/ orders/
│   │   └── about/ contact/
│   └── (admin)/                  Admin route group: AdminShell sidebar layout
│       ├── layout.tsx
│       └── admin/…               35 admin pages (see components-and-routing.md)
├── components/
│   ├── admin/                    AdminShell, CrudAdmin, ProductForm
│   ├── brand/                    Wordmark
│   ├── cart/                     CartDrawer
│   ├── HOME/                     Home-page sections (Hero, CategoryGrid, BestSellers, …)
│   ├── layout/                   AnnouncementBar, Navbar, Footer (storefront chrome)
│   ├── motion/                   Reveal (framer-motion scroll reveal)
│   ├── product/                  ProductCard (static-data card)
│   ├── shop/                     ShopPageClient, ShopFilters
│   ├── site/                     Earlier storefront shell (mostly unused; Hero and ProductCard still used)
│   ├── three/                    JewelScene (React Three Fiber)
│   └── *.tsx                     Landing-page sections (LuxuryHeader, HeroSection, VideoSection, …)
├── data/                         Static content: products.ts, images.ts, site.ts
├── hooks/                        use-hydrated.ts, use-catalog.ts
├── lib/
│   ├── api.ts                    Main fetch-based API client + shared API types + formatPrice
│   ├── api/                      Legacy Axios client for a different API (unused)
│   ├── store.ts                  useAuth store; re-exports cart and wishlist; useSearchStore
│   ├── razorpay.ts               Checkout script loader + Razorpay types
│   ├── format.ts                 formatPrice (AUD)
│   ├── catalog.ts                fetchCatalog() from /api/products, toStorefrontProduct(), getRelatedProducts()
│   ├── filterProducts.ts         Client-side filtering and sorting of the loaded catalogue
│   ├── products.ts, types.ts     Types and helpers for the legacy API client
│   ├── auth-utils.ts             localStorage token helpers for the legacy client
│   └── utils.ts                  cn() class-name helper
├── store/                        Zustand stores: cart.ts, wishlist.ts
├── types/commerce.ts             Static-catalogue domain types
├── public/                       Images, logo, videos (assets/, images/, media/)
├── middleware.ts                 Edge middleware protecting /admin/*
├── next.config.mjs               Rewrites /api → backend, image and build settings
├── tailwind.config.js            Brand colours, fonts, shadows (loaded with @config)
├── postcss.config.js             @tailwindcss/postcss + autoprefixer
└── tsconfig.json                 Path alias "@/*" → "./*"
```

The `@/` import alias resolves to the repository root, so `@/lib/api` means `lib/api.ts`.

## Route groups and layouts

Next.js route groups (folders in parentheses) share a layout without adding a URL segment.

| Layer | File | Wraps | Provides |
| --- | --- | --- | --- |
| Root | `app/layout.tsx` | everything | `<html>`/`<body>`, Google fonts (Playfair Display → `--font-heading`, Jost → `--font-sans`), `globals.css`, the Sonner `<Toaster position="bottom-right" richColors closeButton>`, `<Analytics />` when `NODE_ENV === "production"`, and default metadata (title template `%s \| FLĀMORÁ`) |
| Storefront | `app/(shop)/layout.tsx` | all `(shop)` pages | `AnnouncementBar`, `Navbar`, `<main>`, `CartDrawer`, `Footer` |
| Admin | `app/(admin)/layout.tsx` | all `/admin/*` pages | `AdminShell`: sidebar navigation, header, sign-out. On `/admin/login` and `/admin` it renders only the page. |
| None | `app/page.tsx`, `app/three/page.tsx` | — | Pages outside the groups get only the root layout, and render their own header and footer |

## Entry points and execution flow

1. **Request arrives.** If the path matches `/admin/:path*`, the [edge middleware](components-and-routing.md#admin-route-protection-middlewarets) runs first and may redirect.
2. **Root layout** renders fonts, global CSS and the toaster.
3. **Group layout** renders the storefront chrome or `AdminShell`.
4. **Page** renders. Almost every page is a **client component** (`"use client"`). The exceptions are:
   - `app/(shop)/page.tsx`: an async server component with `dynamic = "force-dynamic"`. It fetches `http://127.0.0.1:8001/api/products?featured=true&limit=4` and `/api/categories` on the server.
   - `app/(shop)/shop/page.tsx`, `collections/page.tsx` and `collections/[slug]/page.tsx`: server components that export `metadata` and render client children.
   - `app/(admin)/admin/page.tsx`: a server-side `redirect("/admin/dashboard")`.
5. **Client hydration.** Zustand `persist` stores rehydrate from `localStorage`. Components that read persisted data use `useHydrated()` to avoid hydration mismatches.
6. **Data fetching** happens in `useEffect` through `lib/api.ts` or direct `fetch("/api/...")` calls. The browser sends these to the same origin, and `next.config.mjs` rewrites them to the backend.

```text
Browser ──► /admin/* ? middleware.ts (cookie check) ──► layout chain ──► page (client)
                                                                         │
                                                  useEffect → fetch("/api/…") ──► Next rewrite ──► Express :8001
```

## Rendering and data strategy

Data sources:

| Source | Used by | Characteristics |
| --- | --- | --- |
| **Backend API** | Products everywhere (shop, search, product detail, collections, wishlist, best sellers), auth, account, checkout, and every admin page | MongoDB data with ObjectId IDs. Products are loaded through [`lib/catalog.ts`](../lib/catalog.ts) and mapped onto the storefront `Product` type. |
| **Static TypeScript data** (`data/products.ts`, `data/site.ts`, `data/images.ts`) | Collection descriptions, testimonials, filter constants, landing-page copy | No product data. The product list that used to be in `data/products.ts` now lives in the database (seeded from `backend/src/seeders/data/storefrontProducts.js`). |

See [State management and data flow](state-management.md#product-catalogue).

## Styling

- **Tailwind CSS v4.** `globals.css` starts with `@import "tailwindcss"`, `@import "tw-animate-css"` and `@config "../tailwind.config.js"`, then defines theme tokens in `@theme inline` and CSS variables.
- **Brand palette** (`tailwind.config.js`):

  | Name | Values |
  |------|--------|
  | `ivory` | `#FBF8F3` |
  | `cream` | `#F4EEE3` |
  | `onyx` | `#0C1210` |
  | `noir` | `#080B0A` |
  | `emerald` | `#04471C`, `deep`, `vault` |
  | `gold` | `#C9A961`, `soft`, `bright`, `muted` |

  There are also `shadow-gold`, `shadow-luxury`, and font families `display` and `sans`.
- **Custom utilities.** `globals.css` defines these with Tailwind v4 `@utility` blocks: `eyebrow`, `logo-emerald`, `logo-ivory`, `logo-gold`, `logo-gold-gradient`, `logo-transition`, `rule-gold`, `glass-panel`, `glass-panel-dark`, `text-gold-gradient`, `text-emerald-gradient`, `link-underline` and `shimmer`. Some pages, mainly the API-driven home, account and admin pages, also use `gold-text`, `hairline`, `glass-card` and `gold-border`. **None of those four is defined** anywhere in the project's CSS or Tailwind config, so they have no effect.
- **Dark mode** is class-based (`darkMode: "class"`, `@custom-variant dark`). No theme toggle is wired up in the current app.
- **Admin** uses a fixed dark palette (`bg-[#0a0a0a]`, `bg-noir`, neutral greys and gold accents).
- `cn()` in `lib/utils.ts` combines `clsx` and `tailwind-merge`.

## Images and media

`next.config.mjs` sets `images.unoptimized: true` and allows any HTTPS remote host. Many components use plain `<img>` tags. Local assets live in `public/assets`, `public/images` (including `flamora.mp4`) and `public/media`.

## Build-time leniency

`next.config.mjs` sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`, and `tsconfig.json` has `strict: false`. Type errors won't fail a build. Run `npx tsc --noEmit` yourself if you want type feedback.
