"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products";
import { useWishlistStore } from "@/store/wishlist";
import { useHydrated } from "@/hooks/use-hydrated";

export default function WishlistPage() {
  const hydrated = useHydrated();
  const ids = useWishlistStore((state) => state.ids);

  const saved = hydrated ? products.filter((product) => ids.includes(product.id)) : [];

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-12 lg:px-20 min-h-[70vh]">
      <div className="border-b border-border pb-8">
        <p className="eyebrow text-gold-deep">FLĀMORÁ</p>
        <h1 className="mt-2 font-display text-[clamp(2.5rem,5vw,3.75rem)]">
          Wishlist
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {hydrated ? `${saved.length} ${saved.length === 1 ? 'saved piece' : 'saved pieces'}` : ''}
        </p>
      </div>

      {!hydrated ? (
        <div className="py-24 text-center text-sm text-muted-foreground">
          Loading wishlist…
        </div>
      ) : saved.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <Heart className="size-10 text-gold-deep" strokeWidth={0.9} />
          <h2 className="mt-5 font-display text-2xl">Your wishlist is empty</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-6">
            Explore our collection and click the heart icon to save your favourite fine jewellery pieces.
          </p>

          <Link
            href="/shop"
            className="mt-8 bg-ink px-9 py-4 text-[11px] uppercase tracking-[0.26em] text-ivory transition-opacity hover:opacity-90"
          >
            Explore the Collection
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}