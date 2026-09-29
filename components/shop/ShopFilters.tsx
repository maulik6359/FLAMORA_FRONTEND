"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { formatPrice } from "@/lib/format";

/*
|--------------------------------------------------------------------------
| Filter options
|--------------------------------------------------------------------------
|
| Defined locally so ShopFilters does not depend on missing exports
| from data/products.ts.
|
*/

const MAX_PRICE = 13000;

const CATEGORIES = [
  { slug: "rings", label: "Rings" },
  { slug: "necklaces", label: "Necklaces" },
  { slug: "earrings", label: "Earrings" },
  { slug: "bracelets", label: "Bracelets" },
];

const ALL_METALS = [
  "18k Yellow Gold",
  "18k White Gold",
  "18k Rose Gold",
  "Platinum",
];

const ALL_GEMSTONES = [
  "Diamond",
  "Emerald",
  "Sapphire",
  "Pearl",
  "None",
];

/*
|--------------------------------------------------------------------------
| Shop Filters
|--------------------------------------------------------------------------
*/

type ShopFilterSearch = {
  q?: string;
  category?: string;
  metal?: string;
  gemstone?: string;
  max?: number;
  sort?: string;
};

export function ShopFilters({ search = {}, onApply }: { search?: ShopFilterSearch; onApply?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
  |--------------------------------------------------------------------------
  | Update search params
  |--------------------------------------------------------------------------
  */

  const updateSearch = (
    patch,
    closeAfterUpdate = true,
  ) => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    Object.entries(patch).forEach(
      ([key, value]) => {
        const shouldRemove =
          value === undefined ||
          value === null ||
          value === "" ||
          (key === "max" &&
            Number(value) === MAX_PRICE);

        if (shouldRemove) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      },
    );

    const query = params.toString();

    const url = query
      ? `${pathname}?${query}`
      : pathname;

    router.replace(url, {
      scroll: false,
    });

    if (closeAfterUpdate) {
      onApply?.();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Toggle filter
  |--------------------------------------------------------------------------
  */

  const toggleFilter = (key, value) => {
    const currentValue = search[key];

    updateSearch({
      [key]:
        currentValue === value
          ? undefined
          : value,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Clear filters
  |--------------------------------------------------------------------------
  */

  const clearFilters = () => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.delete("q");
    params.delete("category");
    params.delete("metal");
    params.delete("gemstone");
    params.delete("max");
    params.delete("sort");

    const query = params.toString();

    const url = query
      ? `${pathname}?${query}`
      : pathname;

    router.replace(url, {
      scroll: false,
    });

    onApply?.();
  };

  return (
    <div className="flex flex-col gap-9">
      {/* Search */}
      <div>
        <label
          htmlFor="filter-search"
          className="eyebrow"
        >
          Search
        </label>

        <input
          id="filter-search"
          type="search"
          value={search.q ?? ""}
          placeholder="Diamond, emerald…"
          onChange={(event) => {
            const value = event.target.value;

            updateSearch(
              {
                q:
                  value.trim() === ""
                    ? undefined
                    : value,
              },
              false,
            );
          }}
          className="mt-3 w-full border-b border-border bg-transparent py-2 text-sm placeholder:text-muted-foreground/60 focus:border-gold-deep focus:outline-none"
        />
      </div>

      {/* Category */}
      <FilterGroup title="Category">
        {CATEGORIES.map((category) => (
          <FilterButton
            key={category.slug}
            active={
              search.category ===
              category.slug
            }
            onClick={() =>
              toggleFilter(
                "category",
                category.slug,
              )
            }
          >
            {category.label}
          </FilterButton>
        ))}
      </FilterGroup>

      {/* Metal */}
      <FilterGroup title="Metal">
        {ALL_METALS.map((metal) => (
          <FilterButton
            key={metal}
            active={
              search.metal === metal
            }
            onClick={() =>
              toggleFilter(
                "metal",
                metal,
              )
            }
          >
            {metal}
          </FilterButton>
        ))}
      </FilterGroup>

      {/* Gemstone */}
      <FilterGroup title="Gemstone">
        {ALL_GEMSTONES.map(
          (gemstone) => (
            <FilterButton
              key={gemstone}
              active={
                search.gemstone ===
                gemstone
              }
              onClick={() =>
                toggleFilter(
                  "gemstone",
                  gemstone,
                )
              }
            >
              {gemstone === "None"
                ? "No stone"
                : gemstone}
            </FilterButton>
          ),
        )}
      </FilterGroup>

      {/* Price */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="filter-price"
            className="eyebrow"
          >
            Max price
          </label>

          <span className="text-xs text-muted-foreground">
            {formatPrice(
              search.max ?? MAX_PRICE,
            )}
          </span>
        </div>

        <input
          id="filter-price"
          type="range"
          min="900"
          max={MAX_PRICE}
          step="100"
          value={
            search.max ?? MAX_PRICE
          }
          onChange={(event) => {
            const value = Number(
              event.target.value,
            );

            updateSearch(
              {
                max:
                  value === MAX_PRICE
                    ? undefined
                    : value,
              },
              false,
            );
          }}
          className="mt-4 w-full cursor-pointer accent-[var(--gold-deep)]"
        />

        <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>
            {formatPrice(900)}
          </span>

          <span>
            {formatPrice(MAX_PRICE)}
          </span>
        </div>
      </div>

      {/* Clear */}
      <button
        type="button"
        onClick={clearFilters}
        className="w-fit text-[11px] uppercase tracking-[0.22em] text-muted-foreground underline decoration-gold-deep underline-offset-4 transition-colors hover:text-foreground"
      >
        Clear all
      </button>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Filter Group
|--------------------------------------------------------------------------
*/

function FilterGroup({
  title,
  children,
}) {
  return (
    <fieldset>
      <legend className="eyebrow">
        {title}
      </legend>

      <div className="mt-4 flex flex-wrap gap-2">
        {children}
      </div>
    </fieldset>
  );
}

/*
|--------------------------------------------------------------------------
| Filter Button
|--------------------------------------------------------------------------
*/

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-3 py-2 text-[10px] uppercase tracking-[0.16em] transition-colors ${
        active
          ? "border-ink bg-ink text-ivory"
          : "border-border text-muted-foreground hover:border-gold-deep hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}