"use client";

import { setStoreCurrency } from "@/lib/currency";

// Rendered by the root layout before the page, so every client component formats prices
// in the store currency from its first render (no flash of the default).
export function StoreCurrency({ currency }: { currency: string }) {
  setStoreCurrency(currency);
  return null;
}
