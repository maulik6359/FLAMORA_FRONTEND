# Known Issues and Discrepancies (Frontend)

While writing these docs, every claim was checked against the source. This page lists frontend problems and the places where the frontend and the backend API don't agree. It's a record of how things stand today. Issues fixed in the QA-audit fixes (1, 2, 3, 4, 5, 6, 7, 12, 13, 16, S9 and the unused-code list; S5 and S8 partly) are marked **Resolved** and keep their numbers (see the root `qa/QA_AUDIT_REPORT.md`).

← Back to the [frontend documentation index](README.md)

Issue numbers are shared with the [backend repository's known-issues page](https://github.com/maulik6359/FLAMORA_BACK/blob/main/docs/known-issues.md), so the same number means the same problem in both repos. Numbers missing here are backend-only issues.

Severity labels:

- **High**: a core user flow fails.
- **Medium**: a feature is incomplete, or the behaviour is surprising.
- **Low**: cleanup or hardening.

---

## Functional issues

### 1. Two pages resolve to `/`

**Status: Resolved** in the QA-audit fixes. `app/(shop)/page.tsx`, which the build silently shadowed and which was never served, was deleted. `/` is `app/page.tsx` only.

**Severity (when open): High.** Both [`app/page.tsx`](../app/page.tsx) (the client-side "cinematic" landing page) and [`app/(shop)/page.tsx`](../app/%28shop%29/page.tsx) (a server component that fetches featured products and categories from the API) map to the URL `/`. Route groups like `(shop)` don't add a URL segment, so Next.js reports a conflict for this path. Remove or move one of the two pages to fix it. The code doesn't say which one is meant to win.

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

**Status: Resolved** in the QA-audit fixes. The page loads `api.myOrders()` and has loading, signed-out, error and empty states.

**Severity (when open): Medium.** [`app/(shop)/orders/page.tsx`](../app/%28shop%29/orders/page.tsx) had its data-loading code commented out, so it always showed the "You haven't placed any orders yet" state.

### 6. Contact, newsletter and inquiry forms aren't connected to the API

**Status: Resolved** in the QA-audit fixes. `/contact`, `components/HOME/Newsletter.tsx` and `components/InquiryOverlay.tsx` call the API and confirm only on success, and the register page subscribes when the newsletter box is ticked. (The shadowed `app/(shop)/page.tsx`, whose newsletter form had no handler, was deleted; see [issue 1](#1-two-pages-resolve-to-).)

**Severity (when open): Medium.** The backend has `POST /api/contact` and `POST /api/newsletter/subscribe`, but none of the storefront forms called them:

- `/contact`: shows a success toast and resets the form, with no network request.
- `components/HOME/Newsletter.tsx`: validates the email format, then shows a toast.
- The newsletter form in `app/(shop)/page.tsx`: has no submit handler.
- `components/InquiryOverlay.tsx`: inputs and a button with no handler.

### 7. Coupons, taxes and shipping don't affect order totals

**Status: Resolved** in the QA-audit fixes. Checkout has a coupon field and a shipping choice, and shows the server's quote (`POST /api/orders/quote`): subtotal − coupon + shipping, with the included tax. The order is created with the same pricing. Delivery charges and the `checkout_*` settings are still not applied by the backend ([backend known issue 7](https://github.com/maulik6359/FLAMORA_BACK/blob/main/docs/known-issues.md#7-coupons-taxes-shipping-and-delivery-charges-dont-affect-order-totals)).

**Severity (when open): Medium.** Checkout never called the coupon endpoint, and the backend set an order's total to its subtotal.

### 12. The admin Categories page shows only active categories

**Status: Resolved** in the QA-audit fixes. The page uses `GET /api/admin/categories`, shows inactive categories with a badge, and can activate or deactivate them.

**Severity (when open): Low.** The admin page used the public `GET /api/categories`, which returns active categories only.

### 13. Prices use mixed currencies

**Status: Resolved** in the QA-audit fixes. There's one currency: the admin `store_currency` setting (default `AUD`). The backend charges new orders in it, and the storefront formats prices with it (`lib/currency.ts`, `lib/format.ts`). Orders keep the currency they were charged in.

**Severity (when open): Low.** The backend charged in `EUR` by default, while `lib/format.ts` formatted every amount as `AUD`.

### 16. Some CSS utility classes are used but never defined

**Status: Resolved** in the QA-audit fixes. `app/globals.css` now defines `gold-text`, `hairline` and `glass-card`. `gold-border` was only used by files that were deleted.

**Severity (when open): Low.** `gold-text`, `hairline`, `glass-card` and `gold-border` appear in markup in `app/(shop)/page.tsx`, `/account`, `/checkout/success`, `/admin/login`, `AdminShell` and several unused `components/site/*` files. They aren't defined in `app/globals.css` or `tailwind.config.js`, so they have no effect.

### 17. The admin review form can't create reviews

**Severity: Low.** The `CrudAdmin` configuration in `app/(admin)/admin/reviews/page.tsx` has no `product` field, but the backend requires `product` on every review. Creating a review from the console fails. Editing existing reviews works.

---

## Security observations

| # | Observation | Location |
| --- | --- | --- |
| S5 | **Partly resolved: the token is readable by JavaScript.** Sign-out calls `POST /api/auth/logout` (server-side revocation), a password change revokes older tokens, and `middleware.ts` now verifies the session with `GET /api/auth/me` instead of trusting the `flamora_role` cookie. Still open: the JWT is stored in `localStorage` (Zustand `persist`) and in a non-`HttpOnly` cookie `flamora_token`. The backend enforces the admin role on every admin API call. | `lib/store.ts`, `middleware.ts` |
| S8 | **Partly resolved: the build ignored type and lint errors.** `next build` now type-checks (`typescript.ignoreBuildErrors` was removed; `tsc` is clean). Still open: lint is skipped (`eslint.ignoreDuringBuilds`, no ESLint config), `tsconfig.json` has `"strict": false`, and there's no CI. | `next.config.mjs`, `tsconfig.json` |
| S9 | **Resolved: the admin login form pre-filled credentials.** The email and password inputs on `/admin/login` used to have hard-coded `defaultValue`s, so a login pair shipped in the client JavaScript bundle. The defaults were removed in the QA-audit fixes. The pair is still in Git history and in any bundle built before the fix, so **rotate that password** wherever it's in use. | `app/(admin)/admin/login/page.tsx` |

---

## Unused or unreachable code

**Resolved** in the QA-audit fixes. A static import graph from every page, layout and the middleware found these modules unreachable, and they were deleted:

- `app/(shop)/page.tsx` (the shadowed home page)
- `app/(shop)/product/[slug]/ProductDetailClient.tsx`
- `components/site/*` (`Footer`, `Hero`, `Navbar`, `ProductCard`, `ScrollExperience`, `SearchInput`, `ShopClient`, `SmoothScrollProvider`)
- `lib/api/*` (the Axios client for a different API shape: `auth`, `axios`, `cart`, `orders`, `products`, `wishlist`)
- `lib/auth-utils.ts`, `lib/products.ts`, `lib/types.ts`, `types/commerce.ts`

The `axios` and `lenis` packages are still listed in `package.json` but no longer imported.
