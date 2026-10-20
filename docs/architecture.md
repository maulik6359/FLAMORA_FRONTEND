# Frontend Architecture

← Back to the [frontend documentation index](README.md)

## Folder structure

```text
frontend/
├── app/                          Next.js App Router
│   ├── layout.tsx                Root layout (async): fonts, globals.css, store currency, <Toaster>, Vercel Analytics
│   ├── page.tsx                  "/" cinematic landing page (client component)
│   ├── globals.css               Tailwind v4 entry, theme tokens, utility classes
│   ├── three/page.tsx            "/three" Three.js showcase (outside both route groups)
│   ├── (shop)/                   Storefront route group: AnnouncementBar + Navbar + CartDrawer + Footer
│   │   ├── layout.tsx
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
│   ├── product/                  ProductCard
│   ├── shop/                     ShopPageClient, ShopFilters
│   ├── three/                    JewelScene (React Three Fiber)
│   └── *.tsx                     Landing-page sections (LuxuryHeader, HeroSection, VideoSection, …)
├── data/                         Static content: products.ts, images.ts, site.ts
├── hooks/                        use-hydrated.ts, use-catalog.ts
├── lib/
│   ├── api.ts                    Main fetch-based API client + shared API types + formatPrice
│   ├── store.ts                  useAuth store; re-exports cart and wishlist; useSearchStore
│   ├── razorpay.ts               Checkout script loader + Razorpay types
│   ├── currency.ts               store currency (from /api/settings/public)
│   ├── format.ts                 formatPrice (store currency)
│   ├── catalog.ts                fetchCatalog() from /api/products, toStorefrontProduct(), getRelatedProducts()
│   ├── filterProducts.ts         Client-side filtering and sorting of the loaded catalogue
│   └── utils.ts                  cn() class-name helper
├── store/                        Zustand stores: cart.ts, wishlist.ts
├── public/                       Images, logo, videos (assets/, images/, media/)
├── middleware.ts                 Edge middleware: verifies the session with /api/auth/me for /admin/*
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
| Root | `app/layout.tsx` | everything | An async server component. Reads the store currency (`fetchStoreCurrency()`, cached for 60 seconds) and renders `<StoreCurrency>` before the page. `<html>`/`<body>`, Google fonts (Playfair Display → `--font-heading`, Jost → `--font-sans`), `globals.css`, the Sonner `<Toaster position="bottom-right" richColors closeButton>`, `<Analytics />` when `NODE_ENV === "production"`, and default metadata (title template `%s \| FLĀMORÁ`) |
| Storefront | `app/(shop)/layout.tsx` | all `(shop)` pages | `AnnouncementBar`, `Navbar`, `<main>`, `CartDrawer`, `Footer` |
| Admin | `app/(admin)/layout.tsx` | all `/admin/*` pages | `AdminShell`: sidebar navigation, header, sign-out. On `/admin/login` and `/admin` it renders only the page. |
| None | `app/page.tsx`, `app/three/page.tsx` | — | Pages outside the groups get only the root layout, and render their own header and footer |

## Entry points and execution flow

1. **Request arrives.** If the path matches `/admin/:path*`, the [edge middleware](components-and-routing.md#admin-route-protection-middlewarets) runs first and may redirect.
2. **Root layout** reads the store currency, then renders fonts, global CSS and the toaster.
3. **Group layout** renders the storefront chrome or `AdminShell`.
4. **Page** renders. Almost every page is a **client component** (`"use client"`). The exceptions are:
   - `app/(shop)/product/[slug]/page.tsx`: a server component (`force-dynamic`) that checks the slug with the API and calls `notFound()` for a real 404, then renders the client `ProductPageClient`.
   - `app/(shop)/shop/page.tsx`, `collections/page.tsx` and `collections/[slug]/page.tsx`: server components that export `metadata` and render client children.
   - `app/(admin)/admin/page.tsx`: a server-side `redirect("/admin/dashboard")`.
5. **Client hydration.** Zustand `persist` stores rehydrate from `localStorage`. Components that read persisted data use `useHydrated()` to avoid hydration mismatches.
6. **Data fetching** happens in `useEffect` through `lib/api.ts` or direct `fetch("/api/...")` calls. The browser sends these to the same origin, and `next.config.mjs` rewrites them to the backend.

```text
Browser ──► /admin/* ? middleware.ts (GET /api/auth/me) ──► layout chain ──► page (client)
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
- **Custom utilities.** `globals.css` defines these with Tailwind v4 `@utility` blocks: `eyebrow`, `logo-emerald`, `logo-ivory`, `logo-gold`, `logo-gold-gradient`, `logo-transition`, `rule-gold`, `glass-panel`, `glass-panel-dark`, `text-gold-gradient`, `text-emerald-gradient`, `link-underline`, `shimmer`, and `gold-text`, `hairline` and `glass-card` (used by the account, checkout-success and admin pages; same looks as `text-gold-gradient`, `rule-gold` and `glass-panel`).
- **Dark mode** is class-based (`darkMode: "class"`, `@custom-variant dark`). No theme toggle is wired up in the current app.
- **Admin** uses a fixed dark palette (`bg-[#0a0a0a]`, `bg-noir`, neutral greys and gold accents).
- `cn()` in `lib/utils.ts` combines `clsx` and `tailwind-merge`.

## Images and media

`next.config.mjs` sets `images.unoptimized: true` and allows any HTTPS remote host. Many components use plain `<img>` tags. Local assets live in `public/assets`, `public/images` (including `flamora.mp4`) and `public/media`.

## Build-time leniency

`next build` checks types ("Checking validity of types"), so a type error fails the build. Lint is still skipped (`eslint.ignoreDuringBuilds: true`, since there's no ESLint config), and `tsconfig.json` has `strict: false`.
