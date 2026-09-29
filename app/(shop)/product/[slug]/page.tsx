"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import {
  getProductBySlug,
  getRelatedProducts,
  products,
} from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import Navbar from "@/components/layout/Navbar";

const accordions = [
  {
    id: "materials",
    label: "Materials & details",
  },
  {
    id: "shipping",
    label: "Shipping & returns",
  },
  {
    id: "care",
    label: "Care guide",
  },
];

export default function ProductPage() {
  const params = useParams();

  const rawSlug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;

  const slug = rawSlug
    ? decodeURIComponent(rawSlug)
    : "";

  const product =
    getProductBySlug(slug) ??
    products.find(
      (item) =>
        item.slug === slug ||
        String(item.id) === slug,
    );

  if (!product) {
    return (
      <main className="min-h-[70vh]">
        <div className="mx-auto max-w-xl px-4 py-32 text-center">
          <p className="eyebrow text-gold-deep">
            FLĀMORÁ
          </p>

          <h1 className="mt-5 font-display text-4xl">
            Piece not found
          </h1>

          <p className="mt-4 text-sm text-muted-foreground">
            The jewellery piece you are looking for is currently unavailable.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-block bg-ink px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-ivory"
          >
            Back to Collection
          </Link>
        </div>
      </main>
    );
  }

  return <ProductContent product={product} />;
}

function ProductContent({ product }: { product: typeof products[number] }) {
  const [imageIndex, setImageIndex] =
    useState(0);

  const metalOptions =
    product.metals?.length > 0
      ? product.metals
      : ["18K Yellow Gold"];

  const sizeOptions =
    product.sizes?.length > 0
      ? product.sizes
      : ["One Size"];

  const [metal, setMetal] =
    useState(metalOptions[0]);

  const [size, setSize] =
    useState(sizeOptions[0]);

  const [quantity, setQuantity] =
    useState(1);

  const wishlistIds = useWishlistStore((state) => state.ids);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const wished = wishlistIds.includes(product.id);

  const [openAccordion, setOpenAccordion] =
    useState("materials");

  const addItem = useCartStore(
    (state) => state.addItem,
  );

  const openCart = useCartStore(
    (state) => state.openCart,
  );

  const relatedProducts =
    getRelatedProducts(product);

  const gemstone =
    detectGemstone(product);

  const rating =
    getRating(product);

  const reviewCount =
    getReviewCount(product);

  const addToBag = () => {
    addItem({
      ...product,
      image: product.images?.[0],
      metal,
      size,
      quantity,
    });

    toast.success("Added to your bag", {
      description: `${product.name} · ${metal} · ${size} · Qty ${quantity}`,
    });

    openCart();
  };

  const buyNow = () => {
    addItem({
      ...product,
      image: product.images?.[0],
      metal,
      size,
      quantity,
    });

    openCart();
  };

  const changeQuantity = (amount: number) => {
    setQuantity((current) => {
      const next = current + amount;

      if (next < 1) {
        return 1;
      }

      if (
        product.stock &&
        next > product.stock
      ) {
        return product.stock;
      }

      return next;
    });
  };

  return (
    <main className="min-h-screen bg-background pb-24 lg:pb-0">
      
      <div className="mx-auto max-w-[1600px] px-4 pb-24 pt-8 md:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
        >
          <Link
            href="/"
            className="transition-colors hover:text-gold-deep"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            href="/shop"
            className="transition-colors hover:text-gold-deep"
          >
            Shop
          </Link>

          <span>/</span>

          <Link
            href={`/shop?category=${encodeURIComponent(
              product.category,
            )}`}
            className="transition-colors hover:text-gold-deep"
          >
            {product.category}
          </Link>

          <span>/</span>

          <span className="text-foreground">
            {product.name}
          </span>
        </nav>

        {/* Product */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* LEFT */}
          <section>
            <div className="group relative aspect-[4/5] overflow-hidden bg-silk">
              {product.images?.[imageIndex] ? (
                <img
                  src={product.images[imageIndex]}
                  alt={product.name}
                  width={1200}
                  height={1500}
                  className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <div className="grid size-full place-items-center text-sm text-muted-foreground">
                  Image unavailable
                </div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {product.images.map(
                  (image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      aria-label={`View image ${index + 1}`}
                      aria-pressed={
                        imageIndex === index
                      }
                      onClick={() =>
                        setImageIndex(index)
                      }
                      className={`aspect-square w-20 overflow-hidden border transition-colors ${
                        imageIndex === index
                          ? "border-ink"
                          : "border-transparent hover:border-border"
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    </button>
                  ),
                )}
              </div>
            )}
          </section>

          {/* RIGHT */}
          <section className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-gold-deep">
              {product.collection}
            </p>

            <h1 className="mt-5 font-display text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.98] tracking-[-0.02em] text-emerald-dark">
              {product.name}
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <p className="font-display text-2xl md:text-3xl">
                {formatPrice(product.price)}
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Star
                  className="size-4 fill-gold text-gold"
                  strokeWidth={1}
                />

                <span>{rating}</span>

                <span>·</span>

                <span>
                  {reviewCount} reviews
                </span>
              </div>

              {product.bestseller && (
                <span className="bg-gold-soft px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-gold-deep">
                  Bestseller
                </span>
              )}

              {product.isNew && (
                <span className="bg-emerald-soft px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-emerald-dark">
                  New arrival
                </span>
              )}
            </div>

            <p className="mt-8 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              {product.description}
            </p>

            {/* Metal */}
            <fieldset className="mt-10">
              <legend className="eyebrow text-gold-deep">
                Metal
              </legend>

              <div className="mt-4 flex flex-wrap gap-2">
                {metalOptions.map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={
                        metal === option
                      }
                      onClick={() =>
                        setMetal(option)
                      }
                      className={`border px-5 py-3 text-[10px] uppercase tracking-[0.17em] transition-colors ${
                        metal === option
                          ? "border-ink bg-ink text-ivory"
                          : "border-border hover:border-gold-deep"
                      }`}
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>
            </fieldset>

            {/* Gemstone */}
            {gemstone !== "None" && (
              <div className="mt-8">
                <p className="eyebrow text-gold-deep">
                  Gemstone
                </p>

                <p className="mt-3 font-display text-xl">
                  {gemstone}
                </p>
              </div>
            )}

            {/* Size */}
            <fieldset className="mt-8">
              <legend className="eyebrow text-gold-deep">
                Size
              </legend>

              <div className="mt-4 flex flex-wrap gap-2">
                {sizeOptions.map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={
                        size === option
                      }
                      onClick={() =>
                        setSize(option)
                      }
                      className={`min-w-12 border px-3 py-3 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                        size === option
                          ? "border-ink bg-ink text-ivory"
                          : "border-border hover:border-gold-deep"
                      }`}
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>
            </fieldset>

            {/* Quantity */}
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <span className="eyebrow text-gold-deep">
                Quantity
              </span>

              <div className="flex items-center border border-border">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() =>
                    changeQuantity(-1)
                  }
                  className="grid size-11 place-items-center transition-colors hover:bg-silk"
                >
                  <Minus
                    className="size-3.5"
                    strokeWidth={1.4}
                  />
                </button>

                <span className="w-10 text-center text-sm">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() =>
                    changeQuantity(1)
                  }
                  className="grid size-11 place-items-center transition-colors hover:bg-silk"
                >
                  <Plus
                    className="size-3.5"
                    strokeWidth={1.4}
                  />
                </button>
              </div>

              <span className="text-xs text-muted-foreground">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={addToBag}
                disabled={
                  product.stock <= 0
                }
                className="flex-1 bg-ink py-4 text-[11px] uppercase tracking-[0.28em] text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add to Bag
              </button>

              <button
                type="button"
                onClick={buyNow}
                disabled={
                  product.stock <= 0
                }
                className="flex-1 border border-ink py-4 text-[11px] uppercase tracking-[0.28em] transition-colors hover:bg-ink hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40"
              >
                Buy Now
              </button>

              <button
                type="button"
                aria-label="Save to wishlist"
                aria-pressed={wished}
                onClick={() => {
                  toggleWishlist(product.id);
                  toast(
                    !wished
                      ? "Saved to wishlist"
                      : "Removed from wishlist",
                  );
                }}
                className="grid size-14 shrink-0 place-items-center border border-border transition-colors hover:border-gold-deep cursor-pointer"
              >
                <Heart
                  className={
                    wished
                      ? "size-5 fill-gold-deep text-gold-deep"
                      : "size-5"
                  }
                  strokeWidth={1.3}
                />
              </button>
            </div>

            {/* Accordions */}
            <div className="mt-12 divide-y divide-border border-y border-border">
              {accordions.map(
                (accordion) => (
                  <div key={accordion.id}>
                    <button
                      type="button"
                      aria-expanded={
                        openAccordion ===
                        accordion.id
                      }
                      onClick={() =>
                        setOpenAccordion(
                          openAccordion ===
                            accordion.id
                            ? ""
                            : accordion.id,
                        )
                      }
                      className="flex w-full items-center justify-between py-5 text-left text-[11px] uppercase tracking-[0.22em]"
                    >
                      {accordion.label}

                      <Plus
                        className={`size-4 transition-transform ${
                          openAccordion ===
                          accordion.id
                            ? "rotate-45"
                            : ""
                        }`}
                        strokeWidth={1.2}
                      />
                    </button>

                    {openAccordion ===
                      accordion.id && (
                      <div className="pb-6 text-sm leading-7 text-muted-foreground">
                        {accordion.id ===
                          "materials" && (
                          <p>
                            {gemstone !==
                            "None"
                              ? `${gemstone} set in ${metal}.`
                              : `${metal}.`}{" "}
                            Each FLĀMORÁ piece is carefully
                            finished and inspected before dispatch.
                          </p>
                        )}

                        {accordion.id ===
                          "shipping" && (
                          <p>
                            Complimentary insured shipping
                            Australia-wide. Orders are securely
                            packaged. Eligible pieces may be
                            returned within 30 days.
                          </p>
                        )}

                        {accordion.id ===
                          "care" && (
                          <p>
                            Store separately in the supplied pouch.
                            Clean gently with warm water and a soft
                            brush. Remove before swimming, sleeping
                            or applying fragrance.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>

            {/* Benefits */}
            <div className="mt-8 grid gap-4 text-xs text-muted-foreground sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Truck
                  className="size-4 text-gold-deep"
                  strokeWidth={1.2}
                />

                Complimentary insured shipping
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck
                  className="size-4 text-gold-deep"
                  strokeWidth={1.2}
                />

                Certified stones
              </div>
            </div>

            <Link
              href="/shop"
              className="mt-10 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-gold-deep"
            >
              <ChevronLeft
                className="size-3.5"
                strokeWidth={1.3}
              />

              Continue shopping
            </Link>
          </section>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mt-28 border-t border-border pt-20">
            <p className="eyebrow text-gold-deep">
              Curated for you
            </p>

            <h2 className="mt-4 font-display text-3xl md:text-4xl">
              You may also like
            </h2>

            <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map(
                (item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                  />
                ),
              )}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Add */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-pearl/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">
            {product.name}
          </p>

          <p className="font-display text-lg">
            {formatPrice(
              product.price * quantity,
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={addToBag}
          disabled={
            product.stock <= 0
          }
          className="shrink-0 bg-ink px-7 py-3.5 text-[10px] uppercase tracking-[0.25em] text-ivory disabled:opacity-40"
        >
          Add to Bag
        </button>
      </div>
    </main>
  );
}

function detectGemstone(product: { name?: string; description?: string; collection?: string }) {
  const text = [
    product.name,
    product.description,
    product.collection,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (text.includes("emerald")) {
    return "Emerald";
  }

  if (text.includes("sapphire")) {
    return "Sapphire";
  }

  if (text.includes("diamond")) {
    return "Diamond";
  }

  if (text.includes("pearl")) {
    return "Pearl";
  }

  return "None";
}

function getRating(product: typeof products[number]) {
  if (product.bestseller) {
    return "4.9";
  }

  if (product.featured) {
    return "4.8";
  }

  return "4.7";
}

function getReviewCount(product: typeof products[number]) {
  if (product.bestseller) {
    return 41;
  }

  if (product.featured) {
    return 28;
  }

  return 16;
}