"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import { filterProducts } from "@/lib/filterProducts";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function SearchPage() {
  const [term, setTerm] = useState("");

  const results = useMemo(() => {
    if (!term.trim()) return [];

    return filterProducts({
      q: term,
    });
  }, [term]);

  return (
    
        <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 ">
      <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)]">
        Search
      </h1>

      <label
        htmlFor="site-search"
        className="sr-only"
      >
        Search jewellery
      </label>

      <input
        id="site-search"
        type="search"
        autoFocus
        value={term}
        onChange={(e) =>
          setTerm(e.target.value)
        }
        placeholder='Try "emerald" or "signet"'
        className="mt-8 w-full max-w-xl border-b border-border bg-transparent py-3 font-display text-2xl focus:border-gold-deep focus:outline-none"
      />

      {term.trim() && (
        <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {results.length}{" "}
          {results.length === 1
            ? "result"
            : "results"}
        </p>
      )}

      <div className="mt-12 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {term.trim() &&
        results.length === 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <p className="font-display text-2xl">
              No results found
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Try searching for another
              piece, metal or gemstone.
            </p>
          </div>
        )}
    </div>
   
  );
}