"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/lib/store";
import { api, formatPrice, type Product } from "@/lib/api";
import { X } from "lucide-react";

export default function WishlistPage() {
  const { ids, toggle } = useWishlist();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      if (ids.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }
      try {
        // Fetch products by ids (via search — MVP fallback: pull all featured/all limit=200 and filter)
        const all = await api.products({ limit: 200 });
        if (cancelled) return;
        setItems(all.items.filter((p) => ids.includes(p._id)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [ids]);

  return (
    <div className="pt-32 pb-24 px-6 lg:px-10 bg-ivory min-h-screen" data-testid="wishlist-page">
      <div className="mx-auto max-w-[1500px]">
        <div className="text-center mb-16">
          <p className="eyebrow">◆ Votre Écrin</p>
          <h1 className="mt-6 font-display text-5xl md:text-6xl text-emerald-vault">
            The <em className="gold-text not-italic">Wishlist</em>
          </h1>
          <div className="hairline mt-6 mx-auto w-24" />
        </div>

        {loading ? (
          <p className="text-center text-onyx/40 eyebrow">Loading…</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-onyx/50 tracking-[0.3em] uppercase text-sm mb-8">No pieces yet</p>
            <Link href="/shop" className="inline-block px-10 py-4 bg-emerald-vault text-ivory text-[11px] tracking-[0.4em] uppercase hover:bg-emerald transition">
              Begin the Journey
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.map((p) => (
              <div key={p._id} className="relative group" data-testid={`wishlist-item-${p.slug}`}>
                <button
                  onClick={() => toggle(p._id)}
                  className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-ivory/80 backdrop-blur grid place-items-center text-onyx/60 hover:text-red-600 transition"
                  data-testid={`wishlist-remove-${p.slug}`}
                >
                  <X size={14} />
                </button>
                <Link href={`/product/${p.slug}`}>
                  <div className="aspect-[4/5] overflow-hidden bg-cream">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1400ms]" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-display text-xl text-onyx">{p.name}</p>
                    <p className="mt-1 text-onyx/60 text-sm">{formatPrice(p.discountPrice || p.price, p.currency)}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
