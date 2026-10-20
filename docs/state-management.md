# State Management and Data Flow

← Back to the [frontend documentation index](README.md)

Global client state lives in **Zustand** stores. Three of them are persisted to `localStorage` with Zustand's `persist` middleware. There's no React Context provider, Redux store or server-state cache such as React Query or SWR. Page-level data is held in component `useState` and loaded in `useEffect`.

## Stores

| Store hook | File | Persisted key | Purpose |
| --- | --- | --- | --- |
| `useAuth` | `lib/store.ts` | `flamora-auth` | The signed-in user and their JWT |
| `useCartStore` (also exported as `useCart` from `lib/store.ts`) | `store/cart.ts` | `flamora-cart` (only `items` is saved) | Shopping bag contents and the drawer's open state |
| `useWishlistStore` (also exported as `useWishlist`) | `store/wishlist.ts` | `flamora-wishlist` | Saved product IDs |
| `useSearchStore` | `lib/store.ts` | not persisted | An `isSearching` flag |

### `useAuth`

```ts
type AuthState = {
  user: User | null;        // { id, name, email, role: "customer" | "admin", phone? }
  token: string | null;     // JWT from /api/auth/login or /register
  setAuth(user, token): void;
  clear(): void;            // forget the session on this device only
  logout(): Promise<void>;  // revoke it on the server, then clear()
};
```

- `setAuth` saves the user and token, and **also writes two cookies**, `flamora_token` and `flamora_role`, with `path=/; max-age=604800 (7 days); samesite=lax`. The edge [middleware](components-and-routing.md#admin-route-protection-middlewarets) reads these cookies, because it can't see `localStorage`.
- `clear` removes both cookies and resets the state. Checkout calls it when the server rejects the session.
- `logout` calls `POST /api/auth/logout`, which revokes every token of the user on the server, and then `clear`. Failure to reach the server doesn't block the local sign-out. It's called by the sign-out buttons in `/account` and `AdminShell`.
- Nothing refreshes or re-checks the token on load. A token that expired on the server stays in the store until an API call fails. There's also no automatic sign-out on a 401 in the main client.

### `useCartStore`

```ts
interface CartItem { id; slug; name; image; price; quantity; metal?; size?; stock? }
```

| Action | Behaviour |
| --- | --- |
| `addItem(item)` / `add` | The line key is `id` (or `productId`, `slug`) + `metal` + `size`. Adding an existing line increases its quantity, capped at `stock` when that's known. |
| `removeItem(id, metal?, size?)` / `remove` | Removes matching lines. If `metal` or `size` is omitted, it matches any value for that field. |
| `updateQuantity(id, qty, metal?, size?)` / `setQty` | A quantity of 0 or less removes the line. Otherwise the quantity is capped at `stock`. |
| `clearCart()` / `clear` | Empties the cart |
| `openCart` / `closeCart` / `toggleCart` | Controls `CartDrawer` |
| `subtotal()` | `Σ price × quantity` |
| `count()` | `Σ quantity` |

The cart lives **only on the client**. The backend has no cart endpoint. Prices in the cart come from the API catalogue at the moment the item was added; the backend recalculates prices from its own database when an order is created.

The store is persisted with `version: 1`. Its `migrate` step drops lines whose `id` isn't a database ObjectId, because carts saved before the catalogue moved to the API held static IDs such as `product-001`, which can't be ordered. The wishlist store does the same.

### `useWishlistStore`

```ts
{ ids: string[]; add; remove; toggle; has; clear; set }
```

This store is entirely local. The backend wishlist endpoints (`/api/wishlist`) **aren't** called by any reachable code. `lib/api.ts` defines `wishlist`, `addWishlist` and `removeWishlist`, but only the unused `ProductDetailClient` calls them.

## Hydration handling

Persisted stores are empty during server rendering and fill in after the browser loads. Components that render persisted values, such as the cart count, the wishlist page and checkout, use `useHydrated()` (`hooks/use-hydrated.ts`). It returns `false` until the first client effect runs, which avoids hydration mismatches. `AdminShell` notes that Zustand might not have rehydrated when it first runs its auth check.

## Product catalogue

Products come from **the API** only (MongoDB through `GET /api/products`). The storefront's product list used to be a static array in `data/products.ts`; it was moved into the database (seeded from `backend/src/seeders/data/storefrontProducts.js`, with the same slugs, images, metals, sizes and collections), so cart and checkout use real IDs and admin changes reach the shop.

| Piece | Role |
| --- | --- |
| [`lib/catalog.ts`](../lib/catalog.ts) | `fetchCatalog(params?)` loads every active product page by page (server components call the backend at `API_INTERNAL_URL`, default `http://127.0.0.1:8001`; the browser uses the `/api` rewrite). `toStorefrontProduct()` maps the API document onto the storefront `Product` type: `id` = `_id`, `category` = category slug, `price` = `discountPrice` when set, `stock` = `stockQuantity`, `featured`/`bestseller`/`isNew` from `isFeatured`/`isBestSeller`/`isNewArrival`. |
| [`hooks/use-catalog.ts`](../hooks/use-catalog.ts) | `useCatalog()` for client components: one shared request per page, refreshed after 60 seconds, with `loading` and `error` states |
| `lib/filterProducts.ts` | Filters and sorts the loaded list for `/shop` and `/search` |

`data/products.ts` keeps the storefront `Product` type, `collections` (collection descriptions and images), `testimonials`, `ALL_METALS`, `ALL_GEMSTONES`, `CATEGORIES`, `getCollectionBySlug` and `formatPrice`. Prices are formatted in the store currency (`lib/currency.ts`), the same one the backend charges in. Each product also carries `rating` and `reviewCount` (approved reviews), which the product page shows, or "No reviews yet". `data/site.ts` holds the landing-page copy (`philosophySteps`, `makingSteps`, `menuItems`), and `data/images.ts` maps image keys to paths.

## Data flow diagrams

### Browsing and adding to the bag

```text
GET /api/products ──► useCatalog() ──► filterProducts(query from URL) ──► ShopPageClient ──► ProductCard ──► /product/[slug]
                                                                                       (wishlist toggle only)
product/[slug] page ── useCatalog(), find by slug ── addItem({id: <ObjectId>, slug, name, image, price, metal, size, stock})
                                                                            ▼
                                                     useCartStore (localStorage "flamora-cart")
                                                                            ▼
                                                     Navbar count · CartDrawer · /cart
```

### Signing in

```text
/auth/login form ──► api.login() ──► POST /api/auth/login ──► { token, user }
                                   └─► useAuth.setAuth(user, token)
                                         ├─ localStorage "flamora-auth"
                                         └─ cookies flamora_token / flamora_role ──► middleware.ts (/admin gate)
```

### Checkout

```text
useCartStore.items ──► POST /api/orders/quote (totals, on every change)
                   ──► POST /api/orders { items, paymentMethod, couponCode, shippingMethodId, shippingAddress }
                   ──► POST /api/payments/create-order ──► Razorpay modal ──► POST /api/payments/verify
                   ──► clearCart() and an inline confirmation
```

See [API integration: checkout flow](api-integration.md#checkout-flow) for the details. The `productId` values are database IDs, so the order is created ([Known issues 2](known-issues.md#2-storefront-catalogue-ids-cant-be-ordered-through-the-api), resolved).

### Admin pages

Admin pages read `token` from `useAuth`. In `useEffect` (re-run when `token` changes) they call `lib/api.ts` helpers or `fetch("/api/admin/...")` with an `Authorization: Bearer` header, keep the results in local `useState`, and reload after each change. Nothing is cached between pages.

## URL state

`/shop` keeps its filters in the query string (`q`, `category`, `metal`, `gemstone`, `max`, `sort`, `view`), using `useSearchParams` and `router.replace`, so filtered views can be shared and bookmarked. `/auth/login` and `/auth/register` read `?from=` to decide where to go after signing in.
