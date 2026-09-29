"use client";

import Link from "next/link";

import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products";
import { useWishlistStore } from "@/store/wishlist";
import { Footer } from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function WishlistPage() {
  const ids = useWishlistStore((state) => state.ids);

  const saved = products.filter((product) => ids.includes(product.id));

  return (
  

    <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-28 container">
      <h1 className="font-heading text-[clamp(2rem,5vw,3.25rem)]">
        Wishlist
      </h1>

      {saved.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-sm text-muted-foreground">
            You haven&apos;t saved anything yet.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-block border border-foreground px-10 py-3.5 text-[11px] uppercase tracking-[0.26em] transition-colors hover:bg-foreground hover:text-background"
          >
            Explore the collection
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
   
    
  );
}