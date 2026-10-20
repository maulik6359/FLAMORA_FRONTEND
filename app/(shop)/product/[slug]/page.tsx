import { notFound } from "next/navigation";

import ProductPageClient from "./ProductPageClient";

export const dynamic = "force-dynamic"; // existence is checked against the API on every request

const API = `${process.env.API_INTERNAL_URL || "http://127.0.0.1:8001"}/api`;

// A piece that doesn't exist (or isn't active) is a real 404, not a 200 "not found" page.
// The page itself renders on the client from the shared catalogue.
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetch(`${API}/products/${encodeURIComponent(slug)}`, { cache: "no-store" }).catch(() => null);
  // Only a definite 404 is turned into one; if the API is unreachable the client page
  // shows its own "couldn't load" message.
  if (res?.status === 404) notFound();
  return <ProductPageClient />;
}
