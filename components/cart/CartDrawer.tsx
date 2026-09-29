"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect } from "react";

import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart";

export function CartDrawer() {
  const store = useCartStore();

  const isOpen = store.isOpen;
  const closeCart = store.closeCart;
  const lines = (store as any).lines ?? (store as any).items ?? [];
  const removeItem = store.removeItem;
  const updateQuantity = store.updateQuantity;

  const subtotal = lines.reduce(
    (sum: any, line: any) => sum + (line.price || 0) * (line.quantity || 0),
    0,
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-pearl shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display text-xl">Your Bag</h2>

              <button
                type="button"
                onClick={closeCart}
                aria-label="Close bag"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-5" strokeWidth={1.2} />
              </button>
            </header>

            {/* Empty Cart */}
            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <ShoppingBag
                  className="size-8 text-gold-deep"
                  strokeWidth={0.9}
                />

                <p className="font-display text-2xl">Your bag is empty</p>

                <p className="text-sm text-muted-foreground">
                  Discover pieces made to be remembered.
                </p>

                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-2 border border-ink px-8 py-3 text-[11px] uppercase tracking-[0.26em] transition-colors hover:bg-ink hover:text-ivory"
                >
                  Explore Jewellery
                </Link>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
                  {lines.map((line: any) => (
                    <motion.li
                      key={
                        line.key ??
                        `${line.id ?? line.productId ?? line.name}-${line.metal ?? "metal"}-${line.size ?? "size"}`
                      }
                      layout
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 py-5"
                    >
                      <img
                        src={line.image}
                        alt={line.name}
                        loading="lazy"
                        className="aspect-[4/5] w-full object-cover"
                      />

                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate font-display text-lg">
                              {line.name}
                            </h3>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {line.metal}
                              {line.size ? ` · ${line.size}` : ""}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(line.key)}
                            aria-label={`Remove ${line.name}`}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <X className="size-4" strokeWidth={1.2} />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          {/* Quantity */}
                          <div className="flex items-center border border-border">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateQuantity(line.key, line.quantity - 1)
                              }
                              className="grid size-8 place-items-center transition-colors hover:bg-muted"
                            >
                              <Minus className="size-3" strokeWidth={1.4} />
                            </button>

                            <span className="w-7 text-center text-sm">
                              {line.quantity}
                            </span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateQuantity(line.key, line.quantity + 1)
                              }
                              className="grid size-8 place-items-center transition-colors hover:bg-muted"
                            >
                              <Plus className="size-3" strokeWidth={1.4} />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-sm">
                            {formatPrice(line.price * line.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                {/* Footer */}
                <footer className="border-t border-border px-6 py-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="uppercase tracking-[0.18em] text-muted-foreground">
                      Subtotal
                    </span>

                    <span className="font-display text-2xl">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Shipping and duties calculated at checkout.
                  </p>

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="mt-5 block bg-ink py-4 text-center text-[11px] uppercase tracking-[0.28em] text-ivory transition-opacity hover:opacity-90"
                  >
                    Checkout
                  </Link>

                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="mt-3 block py-2 text-center text-[11px] uppercase tracking-[0.22em] underline underline-offset-4"
                  >
                    View Bag
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
