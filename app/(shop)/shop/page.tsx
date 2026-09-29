import type { Metadata } from "next";
import { Suspense } from "react";

import { ShopPageClient } from "@/components/shop/ShopPageClient";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";



export const metadata: Metadata = {
  title: "Shop Fine Jewellery — FLĀMORÁ",
  description:
    "Browse rings, necklaces, earrings and bracelets in 18k gold and platinum. Filter by metal, gemstone and price.",
  openGraph: {
    title: "Shop Fine Jewellery — FLĀMORÁ",
    description:
      "Browse rings, necklaces, earrings and bracelets in 18k gold and platinum. Filter by metal, gemstone and price.",
  },
};

function ShopLoading() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-ivory px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <div className="h-3 w-32 animate-pulse bg-gold-soft" />
          <div className="mt-6 h-14 w-72 animate-pulse bg-silk" />
          <div className="mt-5 h-5 w-full max-w-xl animate-pulse bg-silk" />
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-14 md:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
              <div className="aspect-[4/5] animate-pulse bg-silk" />
              <div className="mt-4 h-5 w-3/4 animate-pulse bg-silk" />
              <div className="mt-2 h-4 w-1/3 animate-pulse bg-silk" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function ShopPage() {
  return (
    <div>
    
      <div>
        <Suspense fallback={<ShopLoading />}>
          <ShopPageClient />
        </Suspense>
      </div>

  
    </div>
  );
}
