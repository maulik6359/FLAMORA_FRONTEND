# Forms, Validation and Utilities

← Back to the [frontend documentation index](README.md)

## Approach

Forms use **plain React**: controlled inputs with `useState`, or uncontrolled inputs read through `FormData`. Validation is native HTML (`required`, `type="email"`) plus a few manual checks before submitting. `react-hook-form`, `@hookform/resolvers` and `zod` are installed but **not imported anywhere**.

## Form inventory

| Form | File | Inputs | Client-side validation | Submits to |
| --- | --- | --- | --- | --- |
| Sign in | `app/(shop)/auth/login/page.tsx` | email, password | Trimmed email and password must be present (toast "Please enter your email and password.") | `POST /api/auth/login` |
| Register | `app/(shop)/auth/register/page.tsx` | name, email, password, confirm, newsletter, terms | Required fields present. Password ≥ 6 characters. Password and confirmation match. Terms accepted. | `POST /api/auth/register` (the newsletter choice isn't sent) |
| Admin sign in | `app/(admin)/admin/login/page.tsx` | email, password (uncontrolled) | Role must be `admin` after the response | `POST /api/auth/login` |
| Checkout | `app/(shop)/checkout/page.tsx` | email, name, address, city, postcode (all `required`), phone, payment method | Native `required`. Bag not empty, method selected, token present. | `POST /api/orders`, payments |
| Product | `components/admin/ProductForm.tsx` | See [components](components-and-routing.md#admin-building-blocks) | Native `required` on name, category, description, price and stock | `POST`/`PATCH /api/admin/products` |
| Generic CRUD | `components/admin/CrudAdmin.tsx` | Built from the `fields` config | Native `required` per field | `POST`/`PATCH /api/admin/<resource>` |
| Inventory adjust | `app/(admin)/admin/inventory/page.tsx` | type (select), quantity, reason | Native `required` on type and quantity. Quantity `min={0}`. | `PATCH /api/admin/inventory/:id/adjust` |
| Variant create | `app/(admin)/admin/products/[id]/variants/page.tsx` | sku, price, stock, size, purity, color (sent as `attributes`) | Native `required` on SKU and price | `POST …/variants` |
| Settings | `app/(admin)/admin/settings/page.tsx` | Per-group fields (text, textarea, url, email, number) | None | `PATCH /api/admin/settings/:group` |
| Newsletter campaign | `app/(admin)/admin/newsletter/page.tsx` | subject, HTML content, segment | Server-side checks | `POST /api/admin/newsletter/campaign` |
| Contact reply | `app/(admin)/admin/contact/page.tsx` | message | — | `POST /api/admin/contact-messages/:id/reply` |
| Reports range | `app/(admin)/admin/reports/page.tsx` | from, to dates | — | `GET /api/admin/reports/sales` |
| Contact (storefront) | `app/(shop)/contact/page.tsx` | contact fields | Native | **Nothing is sent.** It shows a toast and resets. |
| Newsletter (home section) | `components/HOME/Newsletter.tsx` | email | Regex `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` | **Nothing is sent.** It shows a toast. |
| Newsletter (API home) | `app/(shop)/page.tsx` | email | — | **No handler** |
| Inquiry overlay | `components/InquiryOverlay.tsx` | name, email, phone, country, message | — | **No handler** |

The backend runs its own checks too. See [Backend validation rules](https://github.com/maulik6359/FLAMORA_BACK/blob/main/docs/error-handling.md#input-validation).

## CrudAdmin forms

`CrudAdmin` builds its modal form from a `fields` array:

```ts
type CrudField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url" | "select" | "checkbox" | "date";
  required?: boolean;
  options?: { value: string; label: string }[];   // for "select"
  placeholder?: string;
  colSpan?: 1 | 2;                                 // textarea always spans 2 columns
};
```

When the form is submitted, it builds the payload from `FormData`:

| Field type | Payload value |
| --- | --- |
| `checkbox` | `true` when checked, otherwise `false`. New records start checked. |
| `number` | `Number(value)`, or `undefined` when empty |
| anything else | The string value. Empty strings are **left out**. |

Because empty values are left out, you can't use the form to clear an existing text field with a PATCH. It creates with `POST`, edits with `PATCH /<endpoint>/<_id>`, and deletes after a `confirm()` dialog.

Example: the reviews page configuration.

```tsx
<CrudAdmin
  title="Reviews"
  endpoint="/admin/reviews"
  fields={[
    { name: "customerName", label: "Reviewer Name" },
    { name: "rating", label: "Rating (1-5)", type: "number", required: true },
    { name: "title", label: "Title", colSpan: 2 },
    { name: "comment", label: "Comment", type: "textarea", colSpan: 2 },
    { name: "status", label: "Status", type: "select", options: [/* pending/approved/rejected/flagged */] },
    { name: "adminReply", label: "Admin Reply", type: "textarea", colSpan: 2 },
  ]}
  …
/>
```

This form has no `product` field, but `Review.product` is required. Creating a review from the admin page therefore fails validation on the backend. Editing an existing review works.

## Error handling

| Layer | Behaviour |
| --- | --- |
| `lib/api.ts` `request()` | Throws `Error(json.message \|\| "HTTP <status>")` on a non-2xx response |
| Pages | Wrap calls in `try/catch` and show `toast.error(err.message)`. Some ignore errors, for example `/account` uses `.catch(() => {})`. |
| `CrudAdmin` | Shows `toast.error(data.message \|\| "Failed")` on save or delete errors. Errors while loading the list aren't caught: they propagate out of `load()`, the `finally` clears the busy flag, and the table stays empty. |
| Checkout | Each step has its own message, for example "Could not initialize Razorpay payment…" or "Failed to load Razorpay SDK…". If a payment fails or is cancelled, the backend is told through `/payments/failure`. |
| Global | No `error.tsx`, `global-error.tsx` or React error boundary exists. Uncaught render errors show the Next.js default error page. |

### Notifications (toasts)

`sonner`'s `<Toaster>` is mounted once in the root layout: bottom-right, rich colours, close button, 4-second duration. Use it from any client component:

```tsx
import { toast } from "sonner";
toast.success("Updated");
toast.error(err.message);
toast.info("Please sign in to access checkout");
toast("Welcome to FLĀMORÁ", { description: "…" });
```

## Utility modules

| Module | Exports | Notes |
| --- | --- | --- |
| `lib/utils.ts` | `cn(...classes)` | `twMerge(clsx(...))` |
| `lib/format.ts` | `formatPrice(value)` | Always **AUD**, `en-AU`, no decimals. Used by storefront pages, the cart, the drawer and filters. |
| `lib/api.ts` | `formatPrice(amount, currency = "EUR")` | `en-US` with the given currency, no decimals. Falls back to `"<CUR> <amount>"`. Used by `/account`. |
| `data/products.ts` | `formatPrice(…)`, `getCollectionBySlug(…)` | Collection and price helpers (no product data) |
| `lib/catalog.ts` | `fetchCatalog(params?)`, `toStorefrontProduct(apiProduct)`, `getRelatedProducts(list, product)`, `isProductId(id)` | Loads every active product from `/api/products`, page by page, and maps it to the storefront `Product` type |
| `hooks/use-catalog.ts` | `useCatalog()` → `{ products, loading, error }` | One shared catalogue request per page, refreshed after 60 seconds |
| `lib/filterProducts.ts` | `filterProducts(products, { q, category, metal, max, sort })`, `MAX_PRICE = 13000` | Filters a loaded catalogue. `sort` can be `price-asc`, `price-desc`, `newest`, or a default order. |
| `lib/razorpay.ts` | `loadRazorpayScript()`, Razorpay option and response types | Injects `checkout.js` once and resolves `true` or `false` |
| `hooks/use-hydrated.ts` | `useHydrated()` | `false` until the component mounts. Guards rendering of persisted state. |
| `lib/store.ts` | `useAuth`, `useCart`, `useWishlist`, `useSearchStore` | See [State management](state-management.md) |
| `lib/products.ts`, `lib/types.ts`, `lib/auth-utils.ts` | Types, mapping helpers and token helpers for the legacy Axios client | Effectively unused. `/orders` imports `formatPrice` from `lib/products.ts`. |

## Animation helpers

- `components/motion/Reveal.tsx` wraps content in a framer-motion element that fades or slides in when scrolled into view.
- `components/ScrollProgress.tsx` draws the scroll progress bar on the landing page.
- `components/three/JewelScene.tsx` is a React Three Fiber canvas, loaded client-side only through `next/dynamic` with `ssr: false`.
