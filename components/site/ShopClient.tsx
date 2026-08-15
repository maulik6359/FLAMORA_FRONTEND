"use client";

import { useTransition, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AlertCircle, RotateCcw } from "lucide-react";
import { type Product, type Category } from "@/lib/api";
import { ProductCard } from "@/components/site/ProductCard";
import { useSearchStore } from "@/lib/store";

interface ShopClientProps {
  initialProducts: Product[];
  totalCount: number;
  categories: Category[];
  currentCategory?: string;
  currentSearch?: string;
  hasError: boolean;
}

export function ShopClient({
  initialProducts,
  totalCount,
  categories,
  currentCategory = "",
  currentSearch = "",
  hasError,
}: ShopClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const isSearching = useSearchStore((s) => s.isSearching);

  // Combine local transitions (e.g. category chips) and global search transitions
  const showLoading = isPending || isSearching;

  const activeCat = useMemo(() => {
    return categories.find((c) => c.slug === currentCategory);
  }, [categories, currentCategory]);

  const handleCategoryChange = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.delete("page"); // Reset pagination

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleClearAll = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  return (
    <div className="pt-32 pb-24 px-6 lg:px-10 bg-ivory min-h-screen" data-testid="shop-page">
      <div className="mx-auto max-w-[1500px]">
        {/* Title Header */}
        <div className="text-center mb-12">
          <p className="eyebrow">◆ La Collection</p>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,5rem)] text-emerald-vault leading-none">
            {activeCat ? <>{activeCat.name}</> : <>The <em className="gold-text not-italic">Complete</em> Collection</>}
          </h1>
          <div className="hairline mt-6 mx-auto w-24" />
          <p className="mt-6 text-onyx/60 font-light text-[13px] tracking-widest h-10">
            {showLoading ? (
              <span className="inline-block animate-pulse">Consulting the archives...</span>
            ) : (
              <>
                {totalCount} piece{totalCount === 1 ? "" : "s"}
                {currentSearch && (
                  <span className="text-gold block mt-2 text-xs italic font-normal tracking-wide lowercase">
                    matching &ldquo;{currentSearch}&rdquo;
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-16" data-testid="category-filters">
          <button
            onClick={() => handleCategoryChange(null)}
            disabled={showLoading}
            className={`px-5 py-2 text-[10px] tracking-[0.35em] uppercase border transition-all ${
              !currentCategory
                ? "bg-emerald-vault text-ivory border-emerald-vault"
                : "border-gold/30 text-onyx/70 hover:border-gold hover:text-onyx"
            } disabled:opacity-50`}
            data-testid="filter-all"
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => handleCategoryChange(c.slug)}
              disabled={showLoading}
              className={`px-5 py-2 text-[10px] tracking-[0.35em] uppercase border transition-all ${
                currentCategory === c.slug
                  ? "bg-emerald-vault text-ivory border-emerald-vault"
                  : "border-gold/30 text-onyx/70 hover:border-gold hover:text-onyx"
              } disabled:opacity-50`}
              data-testid={`filter-${c.slug}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {hasError ? (
          /* Error State UI */
          <div className="text-center py-20 max-w-md mx-auto" data-testid="error-state">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-700 mb-5">
              <AlertCircle size={22} />
            </div>
            <h3 className="font-display text-2xl text-onyx mb-3">Unable to Open the Vault</h3>
            <p className="text-onyx/60 text-sm font-light leading-relaxed">
              We encountered a temporary connection issue. Please check your network and try again.
            </p>
            <button
              onClick={() => router.refresh()}
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 border border-gold text-onyx hover:bg-gold hover:text-onyx transition uppercase text-[10px] tracking-[0.3em] font-medium"
            >
              <RotateCcw size={12} />
              <span>Retry</span>
            </button>
          </div>
        ) : showLoading ? (
          /* Shimmer Loading Skeletons */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" data-testid="loading-state">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-[4/5] bg-cream/50 rounded-xl" />
                <div className="space-y-2 flex flex-col items-center">
                  <div className="h-2 w-1/4 bg-gold/25 rounded" />
                  <div className="h-4 w-2/3 bg-gold/15 rounded" />
                  <div className="h-3 w-1/3 bg-gold/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : initialProducts.length === 0 ? (
          /* Empty State UI */
          <div className="text-center py-24 text-onyx/50 max-w-md mx-auto" data-testid="empty-state">
            <p className="eyebrow">No Pieces Found</p>
            <p className="mt-4 font-display text-2xl text-onyx">The vault is currently empty.</p>
            <p className="mt-2 text-sm font-light leading-relaxed">
              We could not find any items matching your selected criteria. Try adjusting your search term or category filters.
            </p>
            {(currentSearch || currentCategory) && (
              <button
                onClick={handleClearAll}
                className="mt-8 px-6 py-2.5 bg-emerald-vault text-ivory hover:bg-emerald transition-colors uppercase text-[10px] tracking-[0.3em] font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          /* Main Product Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" data-testid="products-grid">
            {initialProducts.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
