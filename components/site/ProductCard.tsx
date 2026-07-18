"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/store";
import { formatPrice, type Product } from "@/lib/api";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const wishlist = useWishlist();
  const active = wishlist.has(product._id);
  const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      data-testid={`product-card-${product.slug}`}
    >
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            wishlist.toggle(product._id);
          }}
          className={`h-9 w-9 rounded-full grid place-items-center backdrop-blur-md transition-all ${
            active ? "bg-gold text-onyx" : "bg-ivory/70 text-onyx/60 hover:bg-gold/80 hover:text-onyx"
          }`}
          aria-label="Wishlist"
          data-testid={`wishlist-toggle-${product.slug}`}
        >
          <Heart size={14} fill={active ? "currentColor" : "none"} />
        </button>
      </div>
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
          {product.images[0] && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              loading="lazy"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ivory/60 to-transparent" />
          {product.stockQuantity <= 3 && product.stockQuantity > 0 && (
            <span className="absolute top-4 left-4 text-[9px] tracking-[0.3em] uppercase text-gold bg-emerald-vault/80 backdrop-blur px-2.5 py-1">
              Last {product.stockQuantity}
            </span>
          )}
        </div>
        <div className="mt-5 text-center">
          <p className="text-[9px] tracking-[0.35em] uppercase text-gold">
            {typeof product.category === "object" ? product.category.name : ""}
          </p>
          <h3 className="mt-2 font-display text-xl text-onyx group-hover:text-emerald transition">
            {product.name}
          </h3>
          <p className="mt-2 text-onyx/60 text-[13px]">{formatPrice(price, product.currency)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
