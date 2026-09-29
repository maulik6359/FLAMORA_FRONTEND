"use client";

import Link from "next/link";
import { useState } from "react";
import React from "react";
import { toast } from "sonner";

import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart";

const fields = [
  {
    id: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
  },
  {
    id: "name",
    label: "Full name",
    type: "text",
    autoComplete: "name",
  },
  {
    id: "address",
    label: "Address",
    type: "text",
    autoComplete: "street-address",
  },
  {
    id: "city",
    label: "City",
    type: "text",
    autoComplete: "address-level2",
  },
  {
    id: "postcode",
    label: "Postcode",
    type: "text",
    autoComplete: "postal-code",
  },
];

export default function CheckoutPage() {
  const store = useCartStore();

  const items =
    store.items ??
    [];

  // Some store implementations expose `clear`, but CartState
  // may not include it in the type. Use a safe any cast
  // to avoid TS error while preserving runtime behavior.
  const clear =
    (store as any).clear ??
    (() => {});

  const [placed, setPlaced] =
    useState("");

  const [busy, setBusy] =
    useState(false);

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0,
  );

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      toast.error("Your bag is empty");
      return;
    }

    setBusy(true);

    setTimeout(() => {
      const orderNumber =
        `FLM-${Date.now()
          .toString()
          .slice(-6)}`;

      clear();

      setPlaced(orderNumber);

      setBusy(false);

      toast.success("Order confirmed", {
        description:
          `Order ${orderNumber} has been created.`,
      });
    }, 700);
  };

  if (placed) {
    return (
      <main className="min-h-[70vh]">
        <div className="mx-auto max-w-xl px-4 py-32 text-center">
          <p className="eyebrow text-gold-deep">
            Order confirmed
          </p>

          <h1 className="mt-5 font-display text-4xl md:text-5xl">
            Thank you
          </h1>

          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            Your order{" "}
            <span className="text-foreground">
              {placed}
            </span>{" "}
            has been received.
          </p>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Your FLĀMORÁ pieces will be prepared
            with care for dispatch.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-block bg-ink px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-ivory"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-20">
        <div className="mb-12">
          <p className="eyebrow text-gold-deep">
            Secure checkout
          </p>

          <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4rem)]">
            Checkout
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            Complete your order with complimentary
            insured delivery.
          </p>
        </div>

        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Checkout Form */}
          <form
            className="space-y-7"
            onSubmit={handleSubmit}
          >
            <div>
              <p className="eyebrow">
                Contact & delivery
              </p>

              <h2 className="mt-3 font-display text-2xl">
                Delivery details
              </h2>
            </div>

            {fields.map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="eyebrow"
                >
                  {field.label}
                </label>

                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  required
                  autoComplete={
                    field.autoComplete
                  }
                  className="mt-3 w-full border-b border-border bg-transparent py-3 text-sm focus:border-gold-deep focus:outline-none"
                />
              </div>
            ))}

            <div>
              <label
                htmlFor="country"
                className="eyebrow"
              >
                Country
              </label>

              <input
                id="country"
                name="country"
                value="Australia"
                readOnly
                className="mt-3 w-full border-b border-border bg-transparent py-3 text-sm text-muted-foreground focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={
                items.length === 0 ||
                busy
              }
              className="w-full bg-ink py-4 text-[11px] uppercase tracking-[0.28em] text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy
                ? "Placing order…"
                : "Place order"}
            </button>

            {items.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Your bag is empty.
              </p>
            )}
          </form>

          {/* Order Summary */}
          <aside className="h-fit border border-border bg-silk/20 p-6 md:p-7 lg:sticky lg:top-28">
            <h2 className="eyebrow">
              Order summary
            </h2>

            {items.length === 0 ? (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">
                  No items in your bag.
                </p>

                <Link
                  href="/shop"
                  className="mt-5 inline-block text-xs uppercase tracking-[0.2em] underline underline-offset-4"
                >
                  Explore Jewellery
                </Link>
              </div>
            ) : (
              <>
                <ul className="mt-6 space-y-5">
                  {items.map(
                    (item, index) => {
                      const itemKey =
                        `${item.id ?? item.slug ?? item.name}-${item.metal ?? "metal"}-${item.size ?? "size"}-${index}`;

                      return (
                        <li
                          key={itemKey}
                          className="flex gap-4 border-b border-border pb-5"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="aspect-[4/5] w-16 shrink-0 object-cover"
                            />
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display text-lg">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.metal}
                              {item.size
                                ? ` · ${item.size}`
                                : ""}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              Qty{" "}
                              {item.quantity}
                            </p>
                          </div>

                          <span className="shrink-0 text-sm">
                            {formatPrice(
                              Number(
                                item.price ||
                                  0,
                              ) *
                                Number(
                                  item.quantity ||
                                    0,
                                ),
                            )}
                          </span>
                        </li>
                      );
                    },
                  )}
                </ul>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      Subtotal
                    </span>

                    <span>
                      {formatPrice(
                        subtotal,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      Shipping
                    </span>

                    <span>
                      Complimentary
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-border pt-4 font-display text-xl">
                    <span>
                      Total
                    </span>

                    <span>
                      {formatPrice(
                        subtotal,
                      )}
                    </span>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}