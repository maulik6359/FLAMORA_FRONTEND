import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/motion/Reveal";
import { IMAGES } from "@/data/images";

const cats = [
  {
    slug: "rings",
    label: "Rings",
    image: IMAGES.ring1,
    count: 4,
  },
  {
    slug: "necklaces",
    label: "Necklaces",
    image: IMAGES.necklace1,
    count: 3,
  },
  {
    slug: "earrings",
    label: "Earrings",
    image: IMAGES.earring1,
    count: 3,
  },
  {
    slug: "bracelets",
    label: "Bracelets",
    image: IMAGES.bracelet1,
    count: 2,
  },
] as const;

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 lg:py-28">
      <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">
            Shop by Category
          </p>

          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-tight">
            Find your form
          </h2>
        </div>

        <Link
          href="/shop"
          className="link-underline w-fit text-[11px] uppercase tracking-[0.24em]"
        >
          View all jewellery
        </Link>
      </Reveal>

      <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cats.map((category) => (
          <StaggerItem key={category.slug} className="">
            <Link
              href={`/shop?category=${category.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden bg-silk"
            >
              <img
                src={category.image}
                alt={category.label}
                width={912}
                height={1104}
                loading="lazy"
                className="size-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.2_0.02_160_/_0.62),transparent_55%)] transition-opacity duration-700 group-hover:opacity-90" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                <div>
                  <h3 className="font-display text-2xl text-ivory">
                    {category.label}
                  </h3>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-ivory/70">
                    {category.count} pieces
                  </p>
                </div>

                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-ivory/40 text-ivory transition-transform duration-500 group-hover:translate-x-1 group-hover:border-ivory">
                  <ArrowRight
                    className="size-4"
                    strokeWidth={1.2}
                  />
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}