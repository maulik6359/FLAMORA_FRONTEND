import Link from "next/link";

import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products";

export function BestSellers() {
  const bestSellers = products
    .filter(
      (product) =>
        product.bestseller || product.featured,
    )
    .slice(0, 4);

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 lg:py-28">
      <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Most Loved</p>

          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-tight">
            Best sellers
          </h2>
        </div>

        <Link
          href="/shop"
          className="link-underline w-fit text-[11px] uppercase tracking-[0.24em]"
        >
          Shop all
        </Link>
      </Reveal>

      <Stagger className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-5 lg:grid-cols-4">
        {bestSellers.map((product) => (
          <StaggerItem key={product.id} className="">
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}