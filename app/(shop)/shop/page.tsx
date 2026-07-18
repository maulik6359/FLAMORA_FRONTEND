import { ProductCard } from "@/components/site/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function fetchProducts(params: { category?: string; search?: string }) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  qs.set("limit", "50");
  try {
    const r = await fetch(`http://127.0.0.1:8001/api/products?${qs}`, { cache: "no-store" });
    if (!r.ok) return { items: [], total: 0 };
    return await r.json();
  } catch {
    return { items: [], total: 0 };
  }
}

async function fetchCategories() {
  try {
    const r = await fetch("http://127.0.0.1:8001/api/categories", { cache: "no-store" });
    if (!r.ok) return [];
    return (await r.json()).categories || [];
  } catch {
    return [];
  }
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; search?: string }> }) {
  const sp = await searchParams;
  const [data, categories] = await Promise.all([fetchProducts(sp), fetchCategories()]);
  const activeCat = categories.find((c: any) => c.slug === sp.category);

  return (
    <div className="pt-32 pb-24 px-6 lg:px-10 bg-ivory min-h-screen" data-testid="shop-page">
      <div className="mx-auto max-w-[1500px]">
        <div className="text-center mb-16">
          <p className="eyebrow">◆ La Collection</p>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,5rem)] text-emerald-vault">
            {activeCat ? <>{activeCat.name}</> : <>The <em className="gold-text not-italic">Complete</em> Collection</>}
          </h1>
          <div className="hairline mt-6 mx-auto w-24" />
          <p className="mt-6 text-onyx/60 font-light">{data.total} piece{data.total === 1 ? "" : "s"}</p>
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-16" data-testid="category-filters">
          <Link
            href="/shop"
            className={`px-5 py-2 text-[10px] tracking-[0.35em] uppercase border transition ${
              !sp.category ? "bg-emerald-vault text-ivory border-emerald-vault" : "border-gold/40 text-onyx/70 hover:border-gold"
            }`}
          >
            All
          </Link>
          {categories.map((c: any) => (
            <Link
              key={c._id}
              href={`/shop?category=${c.slug}`}
              className={`px-5 py-2 text-[10px] tracking-[0.35em] uppercase border transition ${
                sp.category === c.slug ? "bg-emerald-vault text-ivory border-emerald-vault" : "border-gold/40 text-onyx/70 hover:border-gold"
              }`}
              data-testid={`filter-${c.slug}`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {data.items.length === 0 ? (
          <div className="text-center py-24 text-onyx/50">
            <p className="eyebrow">Nothing here yet</p>
            <p className="mt-4 font-display text-2xl">The vault is being restocked.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {data.items.map((p: any, i: number) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
