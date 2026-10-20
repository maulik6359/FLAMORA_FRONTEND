# API Integration

← Back to the [frontend documentation index](README.md)

The frontend talks to the Express backend described in the [API reference](https://github.com/maulik6359/FLAMORA_BACK/blob/main/docs/api-reference.md).

## How requests reach the backend

```text
Browser  fetch("/api/products")  ──►  Next.js :3000  ──rewrite──►  http://127.0.0.1:8001/api/products
Server   fetch(`${API_INTERNAL_URL}/api/…`)  (root layout, collection and product pages, middleware; default http://127.0.0.1:8001)
```

- The rewrite in `next.config.mjs` proxies `/api/:path*` to the backend, so browser calls are same-origin and don't need CORS.
- `NEXT_PUBLIC_API_URL` (`/api`) is the base URL for `lib/api.ts`.

## API clients

### 1. `lib/api.ts` (the main client)

A thin `fetch` wrapper plus a typed `api` object:

```ts
const API = process.env.NEXT_PUBLIC_API_URL || "/api";

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = { "Content-Type": "application/json", ...init.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...init, headers, credentials: "same-origin", cache: "no-store" });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
  return json as T;
}
```

- Tokens are passed **explicitly** to each call. Nothing attaches them automatically.
- A non-2xx response throws an `Error` whose message is the backend's `message` field.
- A non-JSON body, such as Express's HTML 404 page, makes `JSON.parse` throw a `SyntaxError`.

| Method | HTTP call | Used by |
| --- | --- | --- |
| `api.register(data)` | `POST /auth/register` | `/auth/register` |
| `api.login(data)` | `POST /auth/login` | `/auth/login`, `/admin/login` |
| `api.me(token)` | `GET /auth/me` | — (not called) |
| `api.products(params)` | `GET /products?…` | — (the catalogue uses `fetchCatalog`) |
| `api.product(slug)` | `GET /products/:slug` | — |
| `fetchCatalog(params?)` in [`lib/catalog.ts`](../lib/catalog.ts) (not `api.*`) | `GET /products?limit=200&page=…` (every page) | Shop, search, product page, wishlist, best sellers (through `useCatalog()`), `/collections/[slug]` (server) |
| `api.categories()` | `GET /categories` | `ProductForm` |
| `api.paymentMethods()` | `GET /payment-methods` | `/checkout` |
| `api.wishlist` / `addWishlist` / `removeWishlist` | `GET`/`POST`/`DELETE /wishlist[/:id]` | `lib/store.ts` (account wishlist sync for signed-in customers) |
| `api.quoteOrder(data)` | `POST /orders/quote` | `/checkout` (totals before ordering) |
| `api.createOrder(data, token)` | `POST /orders` | `/checkout` |
| `api.myOrders(token)` | `GET /orders/mine` | `/account`, `/orders` |
| `api.contact(data)` | `POST /contact` | `/contact`, `InquiryOverlay` |
| `api.subscribeNewsletter(data)` | `POST /newsletter/subscribe` | `components/HOME/Newsletter.tsx`, `/auth/register` (when the newsletter box is ticked) |
| `api.getOrder(id, token)` | `GET /orders/:id` | `/checkout/success` |
| `api.createRazorpayOrder(orderId, token)` | `POST /payments/create-order` | `/checkout` |
| `api.verifyRazorpayPayment(data, token)` | `POST /payments/verify` | `/checkout` |
| `api.reportPaymentFailure(data, token)` | `POST /payments/failure` | `/checkout` |
| `api.paymentStatus(orderId, token)` | `GET /payments/order/:orderId` | — |
| `api.admin.dashboard(token)` | `GET /admin/dashboard/stats` | `/admin/dashboard` |
| `api.admin.recentOrders(token)` | `GET /admin/dashboard/recent-orders` | `/admin/dashboard` |
| `api.admin.products(params, token)` | `GET /admin/products?…` | `/admin/products` |
| `api.admin.product(id, token)` | `GET /admin/products/:id` | `/admin/products/[id]/edit` |
| `api.admin.createProduct` / `updateProduct` / `deleteProduct` | `POST`/`PATCH`/`DELETE /admin/products[/:id]` | `ProductForm`, `/admin/products` |
| `api.admin.categories(token)` | `GET /admin/categories` (inactive ones included) | `/admin/categories` |
| `api.admin.createCategory` / `updateCategory` | `POST /admin/categories`, `PATCH /admin/categories/:id` | `/admin/categories` |
| `api.admin.updateCustomer(id, data, token)` | `PATCH /admin/customers/:id` (`isBlocked`, `role`) | `/admin/customers` |
| `api.admin.orders(params, token)` | `GET /admin/orders?…` | `/admin/orders` |
| `api.admin.updateOrderStatus(id, data, token)` | `PATCH /admin/orders/:id/status` | `/admin/orders` |

The file also exports the TypeScript types `Product`, `Category`, `Order`, `OrderItem`, `Quote`, `User`, `PaymentMethod`, `RazorpayOrderResponse`, `RazorpayVerifyPayload` and `RazorpayVerifyResponse`, along with `formatPrice(amount, currency?)`, which delegates to `lib/format.ts` (store currency unless a currency is given, for example an order's own).

### 2. Direct `fetch` calls in admin pages

Most phase 2–4 admin pages (and `CrudAdmin`) call `fetch("/api/admin/…", { headers: { Authorization: \`Bearer ${token}\` } })` directly instead of going through `lib/api.ts`. The full mapping is in the [admin routes table](components-and-routing.md#admin-routes). These calls generally parse `res.json()` and either show `data.message` in a toast or ignore errors.

The legacy Axios client that used to live in `lib/api/*.ts` (for a different API shape) was removed in the QA-audit fixes, as nothing imported it.

## Authentication flow

```text
1. User submits /auth/login (or /auth/register)
2. api.login() → { token, user }
3. useAuth.setAuth(user, token)
      ├── persists to localStorage "flamora-auth"
      └── sets cookies flamora_token, flamora_role (7 days, SameSite=Lax, not HttpOnly)
4. Redirect: admin → /admin/dashboard, otherwise → ?from= target or /account
5. Later calls: pages read `token` from useAuth and pass it to api.* or set the Authorization header
6. Sign out: useAuth.logout() calls POST /api/auth/logout (revokes every token of the user),
   then clear() removes the state and cookies. The local sign-out happens even if the call fails.
```

Admin sign-in (`/admin/login`) uses the same `api.login`, but refuses to store the session when `user.role !== "admin"` and shows "This account is not authorized for the console". After a successful sign-in it goes to the `?from=` path, or `/admin/dashboard` by default.

Authorization rules:

| Layer | Check |
| --- | --- |
| `middleware.ts` (edge) | For `/admin/*`, verifies the `flamora_token` cookie with `GET /api/auth/me` and requires `role === "admin"` (see [Admin route protection](components-and-routing.md#admin-route-protection-middlewarets)) |
| `AdminShell` (client) | Redirects to `/admin/login` if the store has no `user` and no `token` |
| `/checkout`, `/account` (client) | Redirect to `/auth/login` when there's no user |
| Backend (authoritative) | `requireAuth` / `requireAdmin` on every protected endpoint |

See also [Backend: authentication and authorization](https://github.com/maulik6359/FLAMORA_BACK/blob/main/docs/authentication-and-authorization.md).

## Checkout flow

Implemented in `app/(shop)/checkout/page.tsx`:

1. **Gate.** Once hydrated, if there's no `user`, the page shows a toast and calls `router.replace("/auth/login?from=/checkout")`.
2. **Load payment methods.** It calls `api.paymentMethods()` and offers only the methods the admin has enabled; Razorpay is pre-selected when it's available. An empty list shows "No payment methods currently active", and a failed request shows an error toast. Nothing is invented on the client.
3. **Totals.** Whenever the bag, the coupon or the shipping choice changes, it calls `api.quoteOrder({ items, couponCode, shippingMethodId, country: "Australia" })` and shows the server's breakdown: subtotal, coupon (with **Remove**), shipping (a radio list when the store offers more than one method), total and "Includes X tax" (prices are tax-inclusive). A refused coupon shows a toast and is removed. The pay button shows the quoted total.
4. **Form.** Email, full name, address, city and postcode are rendered from a `fields` array as native `required` inputs (the email input has `type="email"`). Phone is a separate input. Email, name and phone are pre-filled from the signed-in user.
5. **Submit.**
   1. It checks that the bag isn't empty, a method is selected and a token exists.
   2. It calls `api.createOrder` with:

      ```json
      {
        "items": [{ "productId": "<cart item id>", "quantity": 1 }],
        "paymentMethod": "razorpay",
        "couponCode": "WELCOME10",
        "shippingMethodId": "<the quoted shipping method>",
        "shippingAddress": { "name": "...", "line1": "...", "city": "...", "postalCode": "...", "country": "Australia", "phone": "..." }
      }
      ```

      The address keys follow the backend `AddressSchema`. The form's "address" and "postcode" inputs are sent as `line1` and `postalCode`.
   3. **Razorpay:**
      - It calls `api.createRazorpayOrder(order._id)`, then `loadRazorpayScript()`, then `new Razorpay(options).open()`.
      - **Success handler:** calls `api.verifyRazorpayPayment({...response, orderId})`. On success it clears the cart and shows an inline confirmation with the order number and payment ID.
      - **`modal.ondismiss`:** shows an info toast and calls `api.reportPaymentFailure({ error: "Payment modal closed by customer" })`.
      - **`payment.failed`:** shows an error toast and calls `api.reportPaymentFailure({ error: resp.error })`.
   4. **Any other method (COD):** it clears the cart and shows the confirmation straight away. The order is stored with `paymentMethod: "cod"` and stays `pending` / `unpaid`.
6. A `statusMessage` banner shows progress ("Creating your order...", "Initializing Razorpay checkout...", "Verifying payment security signature...").

`/checkout/success` is a separate page that confirms a payment by polling `GET /api/orders/:id`. The current checkout page shows its own confirmation and doesn't navigate there.

## Server-side fetch

These run on the Next.js server and call the backend directly at `API_INTERNAL_URL` (default `http://127.0.0.1:8001`), with no auth unless stated:

| Caller | Call | On failure |
| --- | --- | --- |
| `app/layout.tsx` (`fetchStoreCurrency()`) | `GET /api/settings/public`, cached for 60 seconds | Keeps the default currency (AUD) |
| `app/(shop)/collections/[slug]/page.tsx` | `fetchCatalog({ collection })` | Shows a "couldn't load" message |
| `app/(shop)/product/[slug]/page.tsx` | `GET /api/products/:slug` | A 404 becomes `notFound()`; an unreachable API renders the client page, which shows its own error |
| `middleware.ts` | `GET /api/auth/me` with the `flamora_token` cookie as Bearer token | Redirects to `/admin/login` (fails closed) |

## Backend endpoints not used by the frontend

`/api/auth/change-password`, `/api/payments/order/:id`, `/api/payments/checkout/status/:id`, `/api/coupons/validate`, `/api/contact`, `/api/newsletter/subscribe`, `/api/faqs`, `/api/blogs*`, `/api/cms/:slug`, `/api/banners`, `/api/reviews*`, `/api/settings/public`, `/api/shipping-methods`, `/api/brands|collections|materials|gemstones` (public), `/api/admin/orders/:id`, the `/api/admin/reviews/:id/reply` endpoint, `/api/admin/contact-messages/:id/mark-read`, `/api/admin/newsletter/subscribers/:id` (DELETE), `/api/admin/notifications/:id/read` and `/api/admin/products/:productId/variants/:variantId` (PATCH).

They're available for future storefront work.
