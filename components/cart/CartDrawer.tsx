"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useAuth } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";

export function CartDrawer() {
  const router = useRouter();
  const store = useCartStore();
  const wishlistStore = useWishlistStore();
  const { user } = useAuth();
  const hydrated = useHydrated();

  const isOpen = store.isOpen;
  const closeCart = store.closeCart;
  const items = store.items ?? [];
  const removeItem = store.removeItem;
  const updateQuantity = store.updateQuantity;

  const subtotal = store.subtotal();

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

  const handleCheckoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeCart();
    if (items.length === 0) {
      toast.error("Your bag is empty");
      return;
    }

    if (!user) {
      toast.info("Please sign in to proceed to checkout");
      router.push("/auth/login?from=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  const handleMoveToWishlist = (line: typeof items[number]) => {
    const itemId = line.id || line.slug;
    if (itemId) {
      wishlistStore.add(itemId);
    }
    removeItem(line.id, line.metal, line.size);
    toast.success("Moved to wishlist", {
      description: `${line.name} added to your wishlist.`,
    });
  };

  const handleRemove = (line: typeof items[number]) => {
    removeItem(line.id, line.metal, line.size);
    toast.success("Removed from bag");
  };

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
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="font-display text-xl">Your Bag</h2>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  {hydrated ? `${store.count()} ${store.count() === 1 ? 'item' : 'items'}` : ''}
                </p>
              </div>

              <button
                type="button"
                onClick={closeCart}
                aria-label="Close bag"
                className="text-muted-foreground transition-colors hover:text-foreground p-1"
              >
                <X className="size-5" strokeWidth={1.2} />
              </button>
            </header>

            {/* Empty Cart */}
            {!hydrated ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-xs text-muted-foreground">Loading bag…</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <ShoppingBag
                  className="size-10 text-gold-deep"
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
                  {items.map((line) => {
                    const lineKey = `${line.id}-${line.metal || ""}-${line.size || ""}`;
                    return (
                      <motion.li
                        key={lineKey}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 py-5"
                      >
                        <div className="overflow-hidden bg-silk">
                          {line.image ? (
                            <img
                              src={line.image}
                              alt={line.name}
                              loading="lazy"
                              className="aspect-[4/5] w-full object-cover"
                            />
                          ) : (
                            <div className="grid aspect-[4/5] place-items-center text-xs text-muted-foreground">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/product/${line.slug || line.id}`}
                                onClick={closeCart}
                                className="truncate font-display text-lg block transition-colors hover:text-gold-deep"
                              >
                                {line.name}
                              </Link>

                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {line.metal || "Standard Metal"}
                                {line.size ? ` · ${line.size}` : ""}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemove(line)}
                              aria-label={`Remove ${line.name}`}
                              className="text-muted-foreground transition-colors hover:text-destructive p-1"
                              title="Remove item"
                            >
                              <Trash2 className="size-4" strokeWidth={1.2} />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            {/* Quantity */}
                            <div className="flex items-center border border-border">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  updateQuantity(
                                    line.id,
                                    Math.max(1, line.quantity - 1),
                                    line.metal,
                                    line.size,
                                  )
                                }
                                className="grid size-8 place-items-center transition-colors hover:bg-muted"
                              >
                                <Minus className="size-3" strokeWidth={1.4} />
                              </button>

                              <span className="w-7 text-center text-sm font-medium">
                                {line.quantity}
                              </span>

                              <button
                                type="button"
                                aria-label="Increase quantity"
                                onClick={() =>
                                  updateQuantity(
                                    line.id,
                                    line.quantity + 1,
                                    line.metal,
                                    line.size,
                                  )
                                }
                                className="grid size-8 place-items-center transition-colors hover:bg-muted"
                              >
                                <Plus className="size-3" strokeWidth={1.4} />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleMoveToWishlist(line)}
                                className="text-muted-foreground transition-colors hover:text-foreground p-1"
                                title="Move to Wishlist"
                              >
                                <Heart className="size-3.5" strokeWidth={1.3} />
                              </button>

                              {/* Price */}
                              <span className="text-sm font-display">
                                {formatPrice(line.price * line.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>

                {/* Footer */}
                <footer className="border-t border-border px-6 py-6 bg-pearl">
                  <div className="flex items-center justify-between text-sm">
                    <span className="uppercase tracking-[0.18em] text-muted-foreground">
                      Subtotal
                    </span>

                    <span className="font-display text-2xl">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Complimentary shipping & taxes calculated at checkout.
                  </p>

                  <a
                    href="/checkout"
                    onClick={handleCheckoutClick}
                    className="mt-5 block bg-ink py-4 text-center text-[11px] uppercase tracking-[0.28em] text-ivory transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    Proceed to Checkout
                  </a>

                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="mt-3 block py-2 text-center text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-muted-foreground hover:text-foreground"
                  >
                    View Bag Details
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

