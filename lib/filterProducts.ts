import { products } from "@/data/products";
import type { Product } from "@/types/commerce";

export interface ProductQuery {
  q?: string;
  category?: string;
  metal?: string;
  max?: number;
  sort?: string;
}

export const MAX_PRICE = 13000;

export function filterProducts(query: ProductQuery): any[] {
  const term = query.q?.trim().toLowerCase() ?? "";

  let list: any[] = products.filter((product) => {
    if (query.category && product.category !== query.category) {
      return false;
    }

    if (
      query.metal &&
      !product.metals?.some(
        (metal) => metal.toLowerCase() === query.metal?.toLowerCase(),
      )
    ) {
      return false;
    }

    if (typeof query.max === "number" && product.price > query.max) {
      return false;
    }

    if (term) {
      const haystack = [
        product.name,
        product.description,
        product.category,
        product.collection,
        ...(product.metals ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(term)) {
        return false;
      }
    }

    return true;
  });

  switch (query.sort) {
    case "price-asc":
      list = [...list].sort((a, b) => a.price - b.price);
      break;

    case "price-desc":
      list = [...list].sort((a, b) => b.price - a.price);
      break;

    case "newest":
      list = [...list].sort(
        (a, b) => Number((b as any).newArrival) - Number((a as any).newArrival),
      );
      break;

    default:
      list = [...list].sort(
        (a, b) => Number(b.featured) - Number(a.featured),
      );
      break;
  }

  return list;
}