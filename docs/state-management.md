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
  clear(): void;
};
```

- `setAuth` saves the user and token, and **also writes two cookies**, `flamora_token` and `flamora_role`, with `path=/; max-age=604800 (7 days); samesite=lax`. The edge [middleware](components-and-routing.md#admin-route-protection-middlewarets) reads these cookies, because it can't see `localStorage`.
- `clear` removes both cookies and resets the state. It's called by sign-out in `/account` and `AdminShell`.
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

The cart lives **only on the client**. The backend has no cart endpoint. Prices in the cart come from the static catalogue. The backend recalculates prices from its own database when an order is created.

### `useWishlistStore`

```ts
{ ids: string[]; add; remove; toggle; has; clear; set }
```

This store is entirely local. The backend wishlist endpoints (`/api/wishlist`) **aren't** called by any reachable code. `lib/api.ts` defines `wishlist`, `addWishlist` and `removeWishlist`, but only the unused `ProductDetailClient` calls them.

## Hydration handling

Persisted stores are empty during server rendering and fill in after the browser loads. Components that render persisted values, such as the cart count, the wishlist page and checkout, use `useHydrated()` (`hooks/use-hydrated.ts`). It returns `false` until the first client effect runs, which avoids hydration mismatches. `AdminShell` notes that Zustand might not have rehydrated when it first runs its auth check.

## Two product catalogues

There are two separate sources of product data, and they aren't linked.

| | Static catalogue | API catalogue |
| --- | --- | --- |
| Source | `data/products.ts` | MongoDB through `/api/products` |
| ID format | `"product-001"` … | 24-character ObjectId |
| Categories | rings, necklaces, earrings, bracelets | Rings, Necklaces, Earrings, Bracelets, Watches (seeded) |
| Price formatting | AUD (`lib/format.ts`) | Currency field, EUR by default |
| Extra fields | `metals[]`, `sizes[]`, `collection`, `stock`, `featured`, `bestseller`, `isNew` | `material`, `gemstone`, `carat`, `stockQuantity`, `isFeatured`, … |
| Used by | `/shop`, `/search`, `/product/[slug]`, `/collections/*`, `/wishlist`, home sections, cart | `(shop)/page.tsx`, the admin console, order and checkout responses |

`data/products.ts` also exports `collections`, `testimonials`, `ALL_METALS`, `ALL_GEMSTONES`, `CATEGORIES` and helper functions (`getProductBySlug`, `getProductById`, `getCollectionBySlug`, `getProductsByCollection`, `getProductsByCategory`, `getFeaturedProducts`, `getBestSellerProducts`, `getNewProducts`, `getRelatedProducts`, `formatPrice`). `data/site.ts` holds the landing-page copy (`philosophySteps`, `makingSteps`, `menuItems`), and `data/images.ts` maps image keys to paths.

## Data flow diagrams

### Browsing and adding to the bag

```text
data/products.ts ──► filterProducts(query from URL) ──► ShopPageClient ──► ProductCard ──► /product/[slug]
                                                                       (wishlist toggle only)
product/[slug] page ── getProductBySlug(slug) ── addItem({id, slug, name, image, price, metal, size, stock})
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
useCartStore.items ──► POST /api/orders { items: [{productId: item.id, quantity}] , shippingAddress }
                   ──► POST /api/payments/create-order ──► Razorpay modal ──► POST /api/payments/verify
                   ──► clearCart() and an inline confirmation
```

See [API integration: checkout flow](api-integration.md#checkout-flow) for the details, and [Known issues 2](known-issues.md#2-storefront-catalogue-ids-cant-be-ordered-through-the-api) for why the `productId` values coming from the static catalogue are rejected.

### Admin pages

Admin pages read `token` from `useAuth`. In `useEffect` (re-run when `token` changes) they call `lib/api.ts` helpers or `fetch("/api/admin/...")` with an `Authorization: Bearer` header, keep the results in local `useState`, and reload after each change. Nothing is cached between pages.

## URL state

`/shop` keeps its filters in the query string (`q`, `category`, `metal`, `gemstone`, `max`, `sort`, `view`), using `useSearchParams` and `router.replace`, so filtered views can be shared and bookmarked. `/auth/login` and `/auth/register` read `?from=` to decide where to go after signing in.
