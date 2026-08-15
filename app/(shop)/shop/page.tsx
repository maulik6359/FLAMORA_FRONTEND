import { ShopClient } from "@/components/site/ShopClient";

export const dynamic = "force-dynamic";

async function fetchProducts(params: { category?: string; search?: string }) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  qs.set("limit", "50");
  try {
    const r = await fetch(`http://127.0.0.1:8001/api/products?${qs}`, { cache: "no-store" });
    if (!r.ok) return { items: [], total: 0, error: true };
    const data = await r.json();
    return { items: data.items || [], total: data.total || 0, error: false };
  } catch (err) {
    console.error("fetchProducts error:", err);
    return { items: [], total: 0, error: true };
  }
}

async function fetchCategories() {
  try {
    const r = await fetch("http://127.0.0.1:8001/api/categories", { cache: "no-store" });
    if (!r.ok) return [];
    return (await r.json()).categories || [];
  } catch (err) {
    console.error("fetchCategories error:", err);
    return [];
  }
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; search?: string }> }) {
  const sp = await searchParams;
  const [data, categories] = await Promise.all([
    fetchProducts(sp),
    fetchCategories(),
  ]);

  return (
    <ShopClient
      initialProducts={data.items}
      totalCount={data.total}
      categories={categories}
      currentCategory={sp.category}
      currentSearch={sp.search}
      hasError={!!data.error}
    />
  );
}
