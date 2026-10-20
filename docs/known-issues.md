# Known Issues and Discrepancies (Frontend)

While writing these docs, every claim was checked against the source. This page lists frontend problems and the places where the frontend and the backend API don't agree. Nothing here has been changed in the code. It's a record of how things stand today.

← Back to the [frontend documentation index](README.md)

Issue numbers are shared with the [backend repository's known-issues page](https://github.com/maulik6359/FLAMORA_BACK/blob/main/docs/known-issues.md), so the same number means the same problem in both repos. Numbers missing here are backend-only issues.

Severity labels:

- **High**: a core user flow fails.
- **Medium**: a feature is incomplete, or the behaviour is surprising.
- **Low**: cleanup or hardening.

---

## Functional issues

### 1. Two pages resolve to `/`

**Severity: High.** Both [`app/page.tsx`](../app/page.tsx) (the client-side "cinematic" landing page) and [`app/(shop)/page.tsx`](../app/%28shop%29/page.tsx) (a server component that fetches featured products and categories from the API) map to the URL `/`. Route groups like `(shop)` don't add a URL segment, so Next.js reports a conflict for this path. Remove or move one of the two pages to fix it. The code doesn't say which one is meant to win.

### 2. Storefront catalogue IDs can't be ordered through the API

**Status: Resolved** in the QA-audit fixes. The static product list was moved into the database (same slugs, images, metals, sizes and collections), and every storefront page now reads `/api/products` through [`lib/catalog.ts`](../lib/catalog.ts). Cart lines and wishlist entries hold database IDs, and the persisted stores drop entries saved under the old static IDs (store version 1).

**Severity (when open): High.** The shop, product detail, search, collection and wishlist pages read products from the static file [`data/products.ts`](../data/products.ts), whose IDs look like `"product-001"`. The cart stores these IDs, and checkout sends them to `POST /api/orders` as `productId`. The backend expects MongoDB ObjectIds, so it can't process these IDs and the order request fails. As a result, checkout can't create an order for items added from the static catalogue. The fix is either to load the catalogue from `/api/products` or to map static items to backend product IDs.

### 3. Checkout shipping address doesn't match the schema

**Status: Resolved** in the QA-audit fixes. Checkout now sends `shippingAddress: { name, line1, city, postalCode, country: "Australia", phone }`, which the backend stores in full (its schema gained `name` and `phone`). The backend now rejects unknown address keys with 400 instead of dropping them.

**Severity (when open): Medium.** Checkout sent `{ name, address, city, postcode, … }`, so only `city` and `country` were stored.

### 4. Admin pages for Brands, Collections, Materials and Gemstones can't load their lists

**Status: Resolved** in the QA-audit fixes. The backend now has the admin list endpoints, and `CrudAdmin` shows an error toast when a list can't be loaded instead of an empty table.

**Severity (when open): Medium.** [`CrudAdmin`](../components/admin/CrudAdmin.tsx) loads rows with `GET /api/admin/<resource>?all=true`. For these four resources the backend had no admin list endpoint. The list endpoint is the **public** `GET /api/<resource>?all=true`. The admin request gets Express's default 404 page (HTML), and `res.json()` in the browser then throws. Creating, editing and deleting still reach valid endpoints.

### 5. The `/orders` page never loads orders

**Severity: Medium.** [`app/(shop)/orders/page.tsx`](../app/%28shop%29/orders/page.tsx) has its data-loading code commented out, so it always shows the "You haven't placed any orders yet" state. Order history does work on `/account`, which calls `GET /api/orders/mine`.

### 6. Contact, newsletter and inquiry forms aren't connected to the API

**Severity: Medium.** The backend has `POST /api/contact` and `POST /api/newsletter/subscribe`, but none of the storefront forms call them:

- `/contact`: shows a success toast and resets the form, with no network request.
- `components/HOME/Newsletter.tsx`: validates the email format, then shows a toast.
- The newsletter form in `app/(shop)/page.tsx`: has no submit handler.
- `components/InquiryOverlay.tsx`: inputs and a button with no handler.

### 7. Coupons, taxes and shipping don't affect order totals

**Severity: Medium.** The backend offers `POST /api/coupons/validate`, and admins can manage taxes, shipping methods, delivery charges and checkout settings. However, checkout never calls the coupon endpoint, and the backend sets an order's total to its subtotal.

### 12. The admin Categories page shows only active categories

**Severity: Low.** The backend has no `GET /api/admin/categories` endpoint. The admin page uses the public `GET /api/categories`, which returns active categories only.

### 13. Prices use mixed currencies

**Severity: Low.** The backend stores prices in `EUR` by default. `lib/format.ts` formats every amount as `AUD` (`en-AU`), while `formatPrice` in `lib/api.ts` uses the item's currency, defaulting to `EUR`. Checkout uses the AUD formatter.

### 16. Some CSS utility classes are used but never defined

**Severity: Low.** `gold-text`, `hairline`, `glass-card` and `gold-border` appear in markup in `app/(shop)/page.tsx`, `/account`, `/checkout/success`, `/admin/login`, `AdminShell` and several unused `components/site/*` files. They aren't defined in `app/globals.css` or `tailwind.config.js`, so they have no effect.

### 17. The admin review form can't create reviews

**Severity: Low.** The `CrudAdmin` configuration in `app/(admin)/admin/reviews/page.tsx` has no `product` field, but the backend requires `product` on every review. Creating a review from the console fails. Editing existing reviews works.

---

## Security observations

| # | Observation | Location |
| --- | --- | --- |
| S5 | **The token is readable by JavaScript.** (Partly mitigated: sign-out now calls `POST /api/auth/logout`, which revokes the token on the server, and a password change revokes older tokens.) The JWT is stored in `localStorage` (Zustand `persist`) and in a non-`HttpOnly` cookie `flamora_token`. The admin middleware trusts the client-written `flamora_role` cookie for routing. The backend still enforces the admin role on every admin API call. | `lib/store.ts`, `middleware.ts` |
| S8 | **The build ignores type and lint errors.** `next.config.mjs` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`, and `tsconfig.json` has `"strict": false`. | `next.config.mjs`, `tsconfig.json` |
| S9 | **Resolved: the admin login form pre-filled credentials.** The email and password inputs on `/admin/login` used to have hard-coded `defaultValue`s, so a login pair shipped in the client JavaScript bundle. The defaults were removed in the QA-audit fixes. The pair is still in Git history and in any bundle built before the fix, so **rotate that password** wherever it's in use. | `app/(admin)/admin/login/page.tsx` |

---

## Unused or unreachable code

These modules aren't imported, directly or indirectly, by any `page.tsx` or `layout.tsx`. This was worked out from a static import graph.

| Module | Notes |
| --- | --- |
| `app/(shop)/product/[slug]/ProductDetailClient.tsx` | An older API-backed product detail component. The live product page is `page.tsx`, which now also reads the API. |
| `components/site/Navbar.tsx`, `Footer.tsx`, `ScrollExperience.tsx`, `SearchInput.tsx`, `ShopClient.tsx`, `SmoothScrollProvider.tsx` | An earlier storefront shell. `components/site/Hero.tsx` and `components/site/ProductCard.tsx` are still used by `app/(shop)/page.tsx`. |
| `lib/api/auth.ts`, `lib/api/cart.ts`, `lib/api/products.ts`, `lib/api/wishlist.ts` | An Axios client for a **different** API shape (`/api/v1`, `/cart`, `/users/me`, `/products/slug/:slug`, `{ status, data }` envelopes) that the FLAMORA backend doesn't implement. |
| `lib/api/orders.ts`, `lib/api/axios.ts`, `lib/auth-utils.ts` | Reachable only through the `/orders` page import. The call itself is commented out. |
