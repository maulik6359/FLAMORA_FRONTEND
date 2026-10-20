// The shop's single currency: the admin "store_currency" setting (Settings → Store),
// read from GET /api/settings/public by the root layout. The backend prices and charges
// every new order in the same currency. AUD until (or unless) the setting says otherwise.
let storeCurrency = "AUD";

export const getStoreCurrency = (): string => storeCurrency;

export function setStoreCurrency(code: unknown): void {
  const value = String(code ?? "").trim().toUpperCase();
  if (/^[A-Z]{3}$/.test(value)) storeCurrency = value;
}

/** Server-side: reads the setting from the backend. Falls back to the current value. */
export async function fetchStoreCurrency(): Promise<string> {
  try {
    const base = `${process.env.API_INTERNAL_URL || "http://127.0.0.1:8001"}/api`;
    const res = await fetch(`${base}/settings/public`, { next: { revalidate: 60 } });
    if (res.ok) setStoreCurrency((await res.json()).settings?.store_currency);
  } catch {
    // backend unreachable (for example during a build): keep the default
  }
  return storeCurrency;
}
