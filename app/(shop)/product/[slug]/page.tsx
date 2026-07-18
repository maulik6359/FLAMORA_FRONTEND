import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/api";
import { ProductDetailClient } from "./ProductDetailClient";

export const dynamic = "force-dynamic";

async function fetchProduct(slug: string) {
  try {
    const r = await fetch(`http://127.0.0.1:8001/api/products/${slug}`, { cache: "no-store" });
    if (!r.ok) return null;
    return (await r.json()).product;
  } catch {
    return null;
  }
}

async function fetchRelated(categoryId: string, excludeId: string) {
  try {
    const r = await fetch(`http://127.0.0.1:8001/api/products?category=${categoryId}&limit=4`, { cache: "no-store" });
    if (!r.ok) return [];
    return ((await r.json()).items || []).filter((p: any) => p._id !== excludeId).slice(0, 3);
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) notFound();
  const categoryId = typeof product.category === "object" ? product.category._id : product.category;
  const related = await fetchRelated(categoryId, product._id);
  const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="pt-28 pb-24 bg-ivory" data-testid="product-detail">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="text-[10px] tracking-[0.3em] uppercase text-onyx/50 mb-8">
          <Link href="/" className="hover:text-gold">Maison</Link> · <Link href="/shop" className="hover:text-gold">Collection</Link> · <span className="text-onyx">{product.name}</span>
        </nav>

        <ProductDetailClient product={product} />

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-32">
            <p className="eyebrow text-center">◆ Vous Aimerez Aussi</p>
            <h3 className="mt-4 mb-12 text-center font-display text-4xl text-emerald-vault">Related <em className="gold-text not-italic">Pieces</em></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((r: any) => (
                <Link key={r._id} href={`/product/${r.slug}`} className="group block" data-testid={`related-${r.slug}`}>
                  <div className="aspect-[4/5] overflow-hidden bg-cream">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.images[0]} alt={r.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1400ms]" />
                  </div>
                  <p className="mt-4 text-center font-display text-xl text-onyx group-hover:text-emerald">{r.name}</p>
                  <p className="mt-1 text-center text-onyx/60 text-sm">{formatPrice(r.discountPrice || r.price, r.currency)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
