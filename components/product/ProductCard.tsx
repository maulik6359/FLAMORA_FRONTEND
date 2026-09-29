"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import {
  formatPrice,
  type Product,
} from "@/data/products";
import { useHydrated } from "@/hooks/use-hydrated";
import { useWishlistStore } from "@/store/wishlist";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({
  product,
}: ProductCardProps) {
  const hydrated = useHydrated();

  const wishlistIds = useWishlistStore(
    (state) => state.ids,
  );

  const toggleWishlist = useWishlistStore(
    (state) => state.toggle,
  );

  const isSaved =
    hydrated && wishlistIds.includes(product.id);

  function handleWishlist(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();

    toggleWishlist(product.id);
  }

  return (
    <article className="group relative">
      <Link
        href={`/product/${product.slug}`}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-silk">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="size-full bg-secondary" />
          )}

          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
            {product.isNew && (
              <span className="bg-pearl/95 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-emerald-dark">
                New
              </span>
            )}

            {product.stock <= 0 && (
              <span className="bg-ink/90 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-ivory">
                Sold out
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              isSaved
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-pearl/90 text-emerald-dark backdrop-blur transition-colors hover:bg-pearl"
          >
            <Heart
              className="size-4"
              strokeWidth={1.3}
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>

        <div className="pt-4">
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            {product.category}
          </p>

          <h3 className="mt-2 font-display text-xl text-emerald-dark">
            {product.name}
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </article>
  );
}