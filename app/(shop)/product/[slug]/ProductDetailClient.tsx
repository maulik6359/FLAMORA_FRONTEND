"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, Shield, Truck } from "lucide-react";
import { toast } from "sonner";
import { useWishlist } from "@/lib/store";
import { formatPrice, type Product } from "@/lib/api";
import { useCartStore } from "@/store/cart";

export function ProductDetailClient({ product }: { product: Product }) {
  const wishlist = useWishlist();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
  const inStock = product.stockQuantity > 0;

  function addToCart() {
    if (!inStock) return;

    addItem({
      id: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price,
      quantity: qty,
      metal: product.material || "18K Yellow Gold",
      size: "One Size",
    });

    openCart();
    toast.success(`${product.name} added to bag`);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-16">
      {/* Gallery */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="aspect-square overflow-hidden bg-cream gold-border"
        >
          {product.images[activeImg] && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={activeImg}
              src={product.images[activeImg]}
              alt={product.name}
              className="h-full w-full object-cover"
              data-testid="product-main-image"
            />
          )}
        </motion.div>
        {product.images.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActiveImg(i)}
                className={`aspect-square overflow-hidden ${i === activeImg ? "ring-2 ring-gold" : "opacity-60 hover:opacity-100"}`}
                data-testid={`gallery-thumb-${i}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="lg:pl-8">
        <p className="eyebrow" data-testid="product-category">
          {typeof product.category === "object" ? product.category.name : "Fine Jewellery"}
        </p>
        <h1 className="mt-4 font-display text-5xl md:text-6xl text-emerald-vault leading-tight" data-testid="product-name">
          {product.name}
        </h1>
        <div className="hairline mt-6 w-16" />

        <div className="mt-8 flex items-baseline gap-4" data-testid="product-price">
          <span className="font-display text-4xl text-gold">{formatPrice(price, product.currency)}</span>
          {product.discountPrice && product.discountPrice > 0 && (
            <span className="text-onyx/40 line-through text-lg">{formatPrice(product.price, product.currency)}</span>
          )}
        </div>

        <p className="mt-8 text-onyx/70 leading-relaxed font-light" data-testid="product-description">
          {product.description}
        </p>

        {/* Attributes */}
        <div className="mt-10 grid grid-cols-2 gap-4 max-w-md">
          {product.material && (
            <div className="glass-card p-4">
              <p className="eyebrow">Material</p>
              <p className="mt-2 text-onyx text-sm">{product.material}</p>
            </div>
          )}
          {product.gemstone && (
            <div className="glass-card p-4">
              <p className="eyebrow">Gemstone</p>
              <p className="mt-2 text-onyx text-sm">{product.gemstone}</p>
            </div>
          )}
          {product.carat && (
            <div className="glass-card p-4">
              <p className="eyebrow">Carat</p>
              <p className="mt-2 text-onyx text-sm">{product.carat} ct</p>
            </div>
          )}
          <div className="glass-card p-4">
            <p className="eyebrow">Availability</p>
            <p className={`mt-2 text-sm ${inStock ? "text-emerald" : "text-red-600"}`}>
              {inStock ? `${product.stockQuantity} in stock` : "Sold out"}
            </p>
          </div>
        </div>

        {/* Quantity + Actions */}
        <div className="mt-10">
          <p className="eyebrow mb-3">Quantity</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gold/40">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-gold/10" data-testid="qty-decrease">
                <Minus size={14} />
              </button>
              <span className="px-6 font-display text-lg" data-testid="qty-value">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stockQuantity, q + 1))} className="px-4 py-3 hover:bg-gold/10" data-testid="qty-increase">
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={addToCart}
              disabled={!inStock}
              className="flex-1 px-8 py-4 bg-emerald-vault text-ivory text-[11px] tracking-[0.4em] uppercase hover:bg-emerald transition disabled:opacity-40"
              data-testid="add-to-cart-btn"
            >
              Add to Bag
            </button>
            <button
              onClick={() => wishlist.toggle(product._id)}
              className={`px-6 py-4 border transition ${
                wishlist.has(product._id)
                  ? "border-gold bg-gold text-emerald-vault"
                  : "border-gold/40 hover:border-gold hover:bg-gold/10"
              }`}
              aria-label="Wishlist"
              data-testid="wishlist-btn"
            >
              <Heart size={16} fill={wishlist.has(product._id) ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-10 grid grid-cols-2 gap-4 text-xs text-onyx/60">
          <div className="flex items-center gap-3"><Shield size={16} className="text-gold" /><span>Certified authentic</span></div>
          <div className="flex items-center gap-3"><Truck size={16} className="text-gold" /><span>Complimentary shipping</span></div>
        </div>
      </div>
    </div>
  );
}
