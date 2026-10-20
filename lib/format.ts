import { getStoreCurrency } from "@/lib/currency";

/** Formats an amount in the store currency (or the given one). Cents are shown only when present. */
export const formatPrice = (value: number, currency: string = getStoreCurrency()): string => {
  const cents = !Number.isInteger(Math.round(value * 100) / 100);
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency,
      minimumFractionDigits: cents ? 2 : 0,
      maximumFractionDigits: cents ? 2 : 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(cents ? 2 : 0)}`;
  }
};
