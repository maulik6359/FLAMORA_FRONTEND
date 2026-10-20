import type { Product, ProductCategory } from "@/data/products";

// The storefront catalogue comes from the API (GET /api/products), so cart and checkout
// use real product IDs and admin changes reach the shop. Pages keep working with the
// storefront `Product` shape; toStorefrontProduct() maps the API document onto it.

/** The fields of an API product document that the storefront reads. */
export interface ApiProduct {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  category?: { slug?: string } | string | null;
  collection?: string;
  metals?: string[];
  sizes?: string[];
  stockQuantity?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating?: number;
  reviewCount?: number;
}

export function toStorefrontProduct(p: ApiProduct): Product {
  const categorySlug = typeof p.category === "object" && p.category ? p.category.slug : undefined;
  return {
    id: p._id,
    slug: p.slug,
    name: p.name,
    category: (categorySlug ?? "") as ProductCategory,
    collection: p.collection ?? "",
    description: p.description ?? "",
    // The price the API charges (see the backend order controller).
    price: p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price,
    images: p.images ?? [],
    metals: p.metals ?? [],
    sizes: p.sizes ?? [],
    stock: p.stockQuantity ?? 0,
    featured: !!p.isFeatured,
    bestseller: !!p.isBestSeller,
    isNew: !!p.isNewArrival,
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
  };
}

const CATALOG_LIMIT = 200; // the API's maximum page size

// Server components call the backend directly; the browser goes through the /api rewrite.
function apiBase(): string {
  if (typeof window === "undefined") {
    return `${process.env.API_INTERNAL_URL || "http://127.0.0.1:8001"}/api`;
  }
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

/**
 * Every active product, newest first, read page by page (the API returns at most 200 per
 * request). `params` are extra API filters, e.g. { collection: "verdant" }.
 */
export async function fetchCatalog(params: Record<string, string> = {}): Promise<Product[]> {
  const all: ApiProduct[] = [];
  for (let page = 1; page <= 50; page++) {
    const qs = new URLSearchParams({ ...params, limit: String(CATALOG_LIMIT), page: String(page) });
    const res = await fetch(`${apiBase()}/products?${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Could not load the collection (HTTP ${res.status})`);
    const data = await res.json();
    const items: ApiProduct[] = data.items ?? [];
    all.push(...items);
    if (items.length < CATALOG_LIMIT || all.length >= (data.total ?? 0)) break;
  }
  return all.map(toStorefrontProduct);
}

/** Pieces from the same collection first, then the same category. */
export function getRelatedProducts(list: Product[], product: Product, limit = 4): Product[] {
  const others = list.filter((item) => item.id !== product.id);
  const sameCollection = others.filter((item) => item.collection && item.collection === product.collection);
  const sameCategory = others.filter(
    (item) => item.category === product.category && !sameCollection.some((related) => related.id === item.id),
  );
  return [...sameCollection, ...sameCategory].slice(0, limit);
}

/** True for a MongoDB ObjectId, the only kind of product ID the API accepts. */
export const isProductId = (id: unknown): id is string => typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);
