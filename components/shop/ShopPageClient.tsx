"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutGrid,
  Rows3,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { ProductCard } from "@/components/product/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { filterProducts } from "@/lib/filterProducts";

function getSearchValues(searchParams:any) {
  const maximumPrice = searchParams.get("max");
  const view = searchParams.get("view");
  const sort = searchParams.get("sort");

  return {
    q: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    metal: searchParams.get("metal") || undefined,
    gemstone: searchParams.get("gemstone") || undefined,

    max:
      maximumPrice && !Number.isNaN(Number(maximumPrice))
        ? Number(maximumPrice)
        : undefined,

    sort: sort || undefined,
    view: view === "list" ? "list" : undefined,
  };
}

export function ShopPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const search = useMemo(
    () => getSearchValues(searchParams),
    [searchParams],
  );

  const results = useMemo(
    () => filterProducts(search),
    [search],
  );

  const view = search.view === "list" ? "list" : "grid";

  const updateSearch = useCallback(
    (updates:any) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          value === "featured"
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const query = params.toString();

      router.replace(
        query ? `${pathname}?${query}` : pathname,
        { scroll: false },
      );
    },
    [pathname, router, searchParams],
  );

  const setView = (nextView:any) => {
    updateSearch({
      view: nextView === "list" ? "list" : undefined,
    });
  };

  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <main className="min-h-screen bg-background container mx-auto">
      {/* Page introduction */}
      <section className="border-b border-border bg-ivory px-4 py-20 md:px-8 md:py-8">
        <div className="mx-auto max-w-[1600px] ">
          <p className="eyebrow text-gold-deep">
            All Jewellery
          </p>

          <h1 className="mt-6 font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] text-emerald-dark">
            The full collection
          </h1>

          <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
            Twelve pieces, each hand-finished in Melbourne. Filter by
            category, metal, gemstone or budget to find yours.
          </p>
        </div>
      </section>

      {/* Shop content */}
      <section className="mx-auto max-w-[1600px] px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
          {/* Desktop filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <ShopFilters search={search} onApply={() => {}} />
            </div>
          </aside>

          <div className="min-w-0">
            {/* Toolbar */}
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border pb-4">
              <p className="min-w-0 truncate text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {results.length}{" "}
                {results.length === 1 ? "piece" : "pieces"}
              </p>

              <div className="flex shrink-0 items-center gap-2">
                {/* Mobile filter button */}
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="flex items-center gap-2 border border-border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-emerald hover:text-emerald lg:hidden"
                >
                  <SlidersHorizontal
                    className="size-3.5"
                    strokeWidth={1.3}
                  />
                  Filters
                </button>

                {/* Sorting */}
                <label className="sr-only" htmlFor="shop-sort">
                  Sort products
                </label>

                <select
                  id="shop-sort"
                  value={search.sort ?? "featured"}
                  onChange={(event) => {
                    const update = {
                      sort:
                        event.target.value === "featured"
                          ? undefined
                          : event.target.value,
                    };
                    updateSearch(update);
                  }}
                  className="max-w-[150px] border border-border bg-transparent px-3 py-2 text-[10px] uppercase tracking-[0.15em] outline-none transition-colors focus:border-gold-deep sm:max-w-none sm:tracking-[0.2em]"
                >
                  <option value="featured">
                    Featured
                  </option>

                  <option value="newest">
                    Newest
                  </option>

                  <option value="price-asc">
                    Price: Low to High
                  </option>

                  <option value="price-desc">
                    Price: High to Low
                  </option>
                </select>

                {/* Grid and list selection */}
                <div className="hidden border border-border sm:flex">
                  <button
                    type="button"
                    aria-label="Grid view"
                    aria-pressed={view === "grid"}
                    onClick={() => setView("grid")}
                    className={`grid size-9 place-items-center transition-colors ${
                      view === "grid"
                        ? "bg-emerald-dark text-ivory"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <LayoutGrid
                      className="size-4"
                      strokeWidth={1.2}
                    />
                  </button>

                  <button
                    type="button"
                    aria-label="List view"
                    aria-pressed={view === "list"}
                    onClick={() => setView("list")}
                    className={`grid size-9 place-items-center transition-colors ${
                      view === "list"
                        ? "bg-emerald-dark text-ivory"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <Rows3
                      className="size-4"
                      strokeWidth={1.2}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty results */}
            {results.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-28 text-center">
                <p className="font-display text-3xl text-emerald-dark">
                  Nothing matches yet
                </p>

                <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                  Try widening your filters or browse the full
                  collection.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-2 border border-ink px-8 py-3 text-[11px] uppercase tracking-[0.26em] transition-colors hover:bg-ink hover:text-ivory"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              /* Products */
              <div
                className={
                  view === "list"
                    ? "mt-10 flex flex-col gap-10"
                    : "mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 xl:grid-cols-3"
                }
              >
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 size-full cursor-default bg-ink/45 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm overflow-y-auto bg-pearl px-6 py-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <h2 className="font-display text-2xl">
                Filters
              </h2>

              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setDrawerOpen(false)}
                className="grid size-10 place-items-center transition-colors hover:text-gold-deep"
              >
                <X
                  className="size-5"
                  strokeWidth={1.2}
                />
              </button>
            </div>

            <div className="mt-8">
              <ShopFilters
                search={search}
                onApply={() => setDrawerOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}