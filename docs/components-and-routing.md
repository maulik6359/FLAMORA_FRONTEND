# Pages, Components and Routing

← Back to the [frontend documentation index](README.md)

Routing uses the Next.js **App Router**, where folders under `app/` map to URL segments. Folders in parentheses, like `(shop)` and `(admin)`, are route groups. They share a layout but don't appear in the URL.

## Storefront routes

| URL | File | Type | Data source | Description |
| --- | --- | --- | --- | --- |
| `/` | `app/page.tsx` | Client | Static | Cinematic landing page: `ScrollProgress`, `LuxuryHeader`, `HeroSection`, `PhilosophySection`, `MakingSection`, `VideoSection`, `EditorialSection`, `LuxuryFooter`, plus the `MenuOverlay` and `InquiryOverlay` overlays. **Conflicts** with the next row. |
| `/` | `app/(shop)/page.tsx` | Server (`force-dynamic`) | API | `site/Hero`, 4 featured products (`/api/products?featured=true&limit=4`), category tiles (`/api/categories`), maison story, newsletter form (no handler) |
| `/shop` | `(shop)/shop/page.tsx` → `components/shop/ShopPageClient` | Server + client | API (`useCatalog`) | Grid or list of products, with loading and error states, and filters (`q`, `category`, `metal`, `gemstone`, `max`, `sort`, `view`) held in the URL query |
| `/search` | `(shop)/search/page.tsx` | Client | API (`useCatalog`) | Text search over the catalogue using `filterProducts` |
| `/product/[slug]` | `(shop)/product/[slug]/page.tsx` | Client | API (`useCatalog`) | Loading state, then the gallery, metal and size selection, quantity, add to bag, wishlist toggle, accordions, related products |
| `/collections` | `(shop)/collections/page.tsx` | Server | Static | Lists `collections` from `data/products.ts` |
| `/collections/[slug]` | `(shop)/collections/[slug]/page.tsx` | Server (`force-dynamic`) | Static description + API products (`fetchCatalog({ collection })`) | Products in one collection. Calls `notFound()` for unknown slugs, and says so if the products can't be loaded. |
| `/cart` | `(shop)/cart/page.tsx` | Client | Cart store | Line items, quantity changes, subtotal, "Checkout" (signed-out users go to `/auth/login?from=/checkout`) |
| `/wishlist` | `(shop)/wishlist/page.tsx` | Client | Wishlist store + API | Catalogue products whose IDs are in the wishlist store |
| `/checkout` | `(shop)/checkout/page.tsx` | Client | API | Requires sign-in. Contact and shipping form, payment method choice, order creation, Razorpay or COD. See [API integration: checkout](api-integration.md#checkout-flow). |
| `/checkout/success` | `(shop)/checkout/success/page.tsx` | Client | API | Reads `order_id`/`orderId` and `payment_id`/`razorpay_payment_id` from the query string. Polls `GET /api/orders/:id` up to 10 times. Clears the cart. The current checkout page shows its own confirmation and doesn't navigate here. |
| `/auth/login` | `(shop)/auth/login/page.tsx` | Client | API | Email and password sign-in. Takes `?from=` for the redirect target. Admins are sent to `/admin/dashboard`. |
| `/auth/register` | `(shop)/auth/register/page.tsx` | Client | API | Name, email, password, confirmation, terms checkbox and newsletter checkbox (the newsletter choice isn't sent) |
| `/login` | `(shop)/login/page.tsx` | Client | — | Legacy path. Redirects with `router.replace("/auth/login")`. |
| `/account` | `(shop)/account/page.tsx` | Client | API | Requires sign-in. Profile cards, an admin console link for admins, order history (`/api/orders/mine`), sign out |
| `/orders` | `(shop)/orders/page.tsx` | Client | — | Always shows the empty state. The loading code is commented out ([Known issue 5](known-issues.md#5-the-orders-page-never-loads-orders)). |
| `/about` | `(shop)/about/page.tsx` | Server | Static | Brand story, with `HOME/BrandStory` and `HOME/Benefits` |
| `/contact` | `(shop)/contact/page.tsx` | Client | — | Contact form that shows a toast but sends nothing |
| `/three` | `app/three/page.tsx` | Client | — | Three.js showcase, with `JewelScene` loaded through `next/dynamic` with `ssr: false` |

Not-found pages use the Next.js default. No custom `not-found.tsx` or `error.tsx` exists.

## Admin routes

All of these live under `app/(admin)/admin/` and render inside `AdminShell`.

| URL | Implementation | Backend endpoints |
| --- | --- | --- |
| `/admin` | Server redirect to `/admin/dashboard` | — |
| `/admin/login` | Custom form. Rejects non-admin accounts on the client. | `POST /api/auth/login` |
| `/admin/dashboard` | KPI cards and a recent-orders table | `GET /api/admin/dashboard/stats`, `/recent-orders` |
| `/admin/products` | Paginated table with search and delete | `GET /api/admin/products`, `DELETE /api/admin/products/:id` |
| `/admin/products/create` | `ProductForm` | `GET /api/categories`, `POST /api/admin/products` |
| `/admin/products/[id]/edit` | `ProductForm`, plus a link to variants | `GET /api/admin/products/:id`, `PATCH /api/admin/products/:id` |
| `/admin/products/[id]/variants` | Variant list, inline create, delete | `GET /api/admin/products/:id`, `GET`/`POST`/`DELETE …/variants` |
| `/admin/categories` | List plus a create form | `GET /api/categories`, `POST /api/admin/categories` |
| `/admin/brands`, `/collections`, `/materials`, `/gemstones` | `CrudAdmin` | `GET /api/admin/<x>?all=true` (no such endpoint, see [Known issue 4](known-issues.md#4-admin-pages-for-brands-collections-materials-and-gemstones-cant-load-their-lists)), `POST`/`PATCH`/`DELETE /api/admin/<x>` |
| `/admin/inventory` | Summary KPIs, low-stock filter, search, adjust modal | `GET /api/admin/inventory`, `PATCH …/:id/adjust` |
| `/admin/inventory/[productId]/history` | Adjustment history table | `GET /api/admin/products/:id`, `GET /api/admin/inventory/:id/history` |
| `/admin/orders` | Status filter tabs and an inline status `<select>` | `GET /api/admin/orders`, `PATCH /api/admin/orders/:id/status` |
| `/admin/customers` | Customer table (first 50) | `GET /api/admin/customers?limit=50` |
| `/admin/coupons` | `CrudAdmin` | `/api/admin/coupons` |
| `/admin/offers` | `CrudAdmin` | `/api/admin/offers` |
| `/admin/banners` | `CrudAdmin` | `/api/admin/banners` |
| `/admin/homepage` | `CrudAdmin` | `/api/admin/homepage-sections` |
| `/admin/cms` | `CrudAdmin` | `/api/admin/cms` |
| `/admin/blog` | `CrudAdmin` | `/api/admin/blogs` |
| `/admin/faqs` | `CrudAdmin` | `/api/admin/faqs` |
| `/admin/reviews` | `CrudAdmin` with Approve and Reject buttons | `/api/admin/reviews`, `PATCH …/:id/approve\|reject` |
| `/admin/contact` | Status tabs (all, unread, read, replied, archived) and a reply modal | `GET /api/admin/contact-messages`, `POST …/:id/reply` |
| `/admin/newsletter` | Tabs: subscribers, send campaign, history | `GET …/newsletter/subscribers?limit=200`, `GET …/campaigns`, `POST …/campaign` |
| `/admin/notifications` | Inbox with unread count and "Mark all read" | `GET /api/admin/notifications`, `PATCH …/read-all` |
| `/admin/analytics` | Recharts: daily revenue, top products, revenue by category | `GET /api/admin/analytics/{sales,products,revenue-by-category}` |
| `/admin/reports` | Date range picker, then revenue, order count and average order value | `GET /api/admin/reports/sales?from=&to=` |
| `/admin/payment-methods` | `CrudAdmin`, a Razorpay status banner and an enable/disable toggle | `/api/admin/payment-methods` |
| `/admin/shipping-methods` | `CrudAdmin` | `/api/admin/shipping-methods` |
| `/admin/taxes` | `CrudAdmin` | `/api/admin/taxes` |
| `/admin/delivery-charges` | `CrudAdmin` | `/api/admin/delivery-charges` |
| `/admin/settings` | Tabbed form (Store, SEO, Social, Checkout) that saves one group at a time | `GET /api/admin/settings`, `PATCH /api/admin/settings/:group` |
| `/admin/audit-logs` | Filterable table with expandable change payloads | `GET /api/admin/audit-logs` |

The sidebar (`AdminShell`) groups these pages under **Overview**, **Catalogue**, **Commerce**, **Content**, **Engagement**, **Metrics** and **Configuration**. The sidebar is hidden below the `lg` breakpoint, and the mobile menu button has no handler.

## Admin route protection (`middleware.ts`)

The edge middleware runs for `matcher: ["/admin/:path*"]`:

| Condition | Result |
| --- | --- |
| No `flamora_token` cookie and the path isn't `/admin/login` | Redirect to `/admin/login?from=<path>` |
| `flamora_token` cookie present and the path is `/admin/login` | Redirect to `/admin/dashboard` |
| Token present, `flamora_role` cookie isn't `admin`, and the path isn't the login page | Redirect to `/` |
| Otherwise | Continue |

The middleware only checks that the cookies **exist** and what `flamora_role` says. It doesn't verify the JWT. Real authorization happens in the backend. `AdminShell` adds a client-side check: if the auth store has neither `user` nor `token`, it calls `router.replace("/admin/login")`.

Storefront pages protect themselves on the client. `/checkout` redirects to `/auth/login?from=/checkout` when signed out, and `/account` redirects to `/auth/login`.

## Navigation

- **Storefront `Navbar`** (`components/layout/Navbar.tsx`): category links with dropdowns, plus search (`/search`), account (`/account`, or `/auth/login` when signed out), wishlist (with a count from the wishlist store) and a bag button that opens `CartDrawer`.
- **`AnnouncementBar`**: three static selling points, about shipping, secure checkout and returns.
- **`Footer`** (`components/layout/Footer.tsx`): static links plus the `Wordmark`.
- **Landing page** (`app/page.tsx`): its own `LuxuryHeader` and `MenuOverlay`. Menu items come from `data/site.ts`.

## Component catalogue

### Layout and chrome

| Component | File | Purpose |
| --- | --- | --- |
| `AnnouncementBar` | `components/layout/AnnouncementBar.tsx` | Top promo strip |
| `Navbar` (default export) | `components/layout/Navbar.tsx` | Storefront header. Reads the auth, cart and wishlist stores. |
| `Footer` | `components/layout/Footer.tsx` | Storefront footer |
| `CartDrawer` | `components/cart/CartDrawer.tsx` | Slide-in bag driven by `useCartStore.isOpen`. Closes on Escape. Checkout button checks sign-in. |
| `Wordmark` | `components/brand/Wordmark.tsx` | Brand logotype |
| `AdminShell` | `components/admin/AdminShell.tsx` | Admin sidebar, header and sign-out |

### Admin building blocks

| Component | Purpose |
| --- | --- |
| `CrudAdmin` | A generic list, create, edit and delete screen. Props: `title`, `eyebrow`, `endpoint`, `fields: CrudField[]`, `columns: CrudColumn[]`, and an optional `extraActions(row, refresh)`. An endpoint that doesn't start with `/admin/` gets `/admin` added in front. Lists load from `/api<endpoint>?all=true`. The form is a modal built from `fields`, whose types can be `text`, `textarea`, `number`, `url`, `select`, `checkbox` or `date`. See [Forms](forms-validation-and-utilities.md#crudadmin-forms). |
| `ProductForm` | The create and edit form for products: name, category (from `/api/categories`), description, price, discount price, currency, stock, material, gemstone, carat, image URLs (one per line, with a preview), and flags (Featured, New Arrival, Best Seller, Trending, Active) |

### Storefront content

| Component(s) | Location | Used by |
| --- | --- | --- |
| `ProductCard` | `components/product/` | Shop, search, collections, wishlist, product page, `HOME/BestSellers`. Static product shape. Links to `/product/[slug]` and has a wishlist toggle. Adding to the bag happens on the product page. |
| `ProductCard` (site) | `components/site/` | `app/(shop)/page.tsx` (API product shape) |
| `ShopPageClient`, `ShopFilters` | `components/shop/` | `/shop` |
| `Hero`, `CategoryGrid`, `FeaturedCollection`, `BestSellers`, `BrandStory`, `CampaignBanner`, `Testimonials`, `Benefits`, `Newsletter` | `components/HOME/` | Imported by `app/page.tsx`, but their JSX there is commented out. `BrandStory` and `Benefits` render on `/about`. |
| `LuxuryHeader`, `HeroSection`, `PhilosophySection`, `MakingSection`, `VideoSection`, `EditorialSection`, `LuxuryFooter`, `MenuOverlay`, `InquiryOverlay`, `ScrollProgress` | `components/` | `app/page.tsx` |
| `Reveal` | `components/motion/` | A framer-motion fade or slide-in on scroll, used by the HOME sections |
| `JewelScene` | `components/three/` | `/three`. A React Three Fiber scene that reacts to the cursor. |
| `Hero` (site) | `components/site/` | `app/(shop)/page.tsx` |

Unused components are listed in [Known issues: unused or unreachable code](known-issues.md#unused-or-unreachable-code).
