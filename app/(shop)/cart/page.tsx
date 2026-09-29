"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const store = useCartStore();

  const items =
    store.items ??
    [];

  const updateQuantity =
    store.updateQuantity;

  const removeItem =
    store.removeItem;

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0,
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-20">
        {/* Header */}
        <div className="border-b border-border pb-10">
          <p className="eyebrow text-gold-deep">
            FLĀMORÁ
          </p>

          <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4rem)]">
            Your Bag
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            Review your selected jewellery before continuing
            to secure checkout.
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <ShoppingBag
              className="size-10 text-gold-deep"
              strokeWidth={1}
            />

            <h2 className="mt-6 font-display text-3xl">
              Your bag is empty
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
              Discover our collections and add your favourite
              pieces to begin.
            </p>

            <Link
              href="/shop"
              className="mt-8 bg-ink px-9 py-4 text-[11px] uppercase tracking-[0.26em] text-ivory transition-opacity hover:opacity-90"
            >
              Explore Jewellery
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Cart Items */}
            <ul className="divide-y divide-border border-y border-border">
              {items.map((item, index) => {
                const itemKey =
                  `${item.id ?? item.slug ?? item.name}-${item.metal ?? "metal"}-${item.size ?? "size"}-${index}`;

                return (
                  <li
                    key={itemKey}
                    className="grid grid-cols-[90px_minmax(0,1fr)] gap-5 py-6 sm:grid-cols-[110px_minmax(0,1fr)_auto]"
                  >
                    {/* Image */}
                    <div className="overflow-hidden bg-silk">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="aspect-[4/5] size-full object-cover"
                        />
                      ) : (
                        <div className="grid aspect-[4/5] place-items-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <p className="truncate font-display text-xl">
                        {item.name}
                      </p>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {item.metal}
                        {item.size
                          ? ` · Size ${item.size}`
                          : ""}
                      </p>

                      {/* Quantity */}
                      <div className="mt-5 flex w-fit items-center border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(
                              itemKey,
                              Math.max(
                                1,
                                Number(item.quantity || 1) - 1,
                              ),
                            )
                          }
                          className="grid size-9 place-items-center transition-colors hover:bg-silk"
                        >
                          <Minus
                            className="size-3"
                            strokeWidth={1.4}
                          />
                        </button>

                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(
                              itemKey,
                              Number(item.quantity || 1) + 1,
                            )
                          }
                          className="grid size-9 place-items-center transition-colors hover:bg-silk"
                        >
                          <Plus
                            className="size-3"
                            strokeWidth={1.4}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Price / Remove */}
                    <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end">
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() =>
                          removeItem(itemKey)
                        }
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X
                          className="size-4"
                          strokeWidth={1.2}
                        />
                      </button>

                      <span className="font-display text-lg">
                        {formatPrice(
                          Number(item.price || 0) *
                            Number(item.quantity || 0),
                        )}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Summary */}
            <aside className="h-fit border border-border bg-silk/20 p-7 lg:sticky lg:top-28">
              <h2 className="eyebrow">
                Order Summary
              </h2>

              <dl className="mt-7 space-y-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Subtotal
                  </dt>

                  <dd>
                    {formatPrice(subtotal)}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Shipping
                  </dt>

                  <dd>
                    Complimentary
                  </dd>
                </div>

                <div className="flex justify-between border-t border-border pt-5">
                  <dt className="font-display text-xl">
                    Total
                  </dt>

                  <dd className="font-display text-xl">
                    {formatPrice(subtotal)}
                  </dd>
                </div>
              </dl>

              <Link
                href="/checkout"
                className="mt-8 block bg-ink py-4 text-center text-[11px] uppercase tracking-[0.28em] text-ivory transition-opacity hover:opacity-90"
              >
                Checkout
              </Link>

              <Link
                href="/shop"
                className="mt-4 block text-center text-[10px] uppercase tracking-[0.22em] text-muted-foreground underline underline-offset-4"
              >
                Continue Shopping
              </Link>

              <p className="mt-6 text-center text-[11px] leading-5 text-muted-foreground">
                Complimentary insured shipping on all orders.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}