import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { collections } from "@/data/products";

export const metadata: Metadata = {
  title: "Collections — FLĀMORÁ Jewellery",
  description:
    "Discover the FLĀMORÁ jewellery collections, from timeless signatures to limited atelier creations.",
};

export default function CollectionsPage() {
  return (
    <main>
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
          <p className="eyebrow text-gold-deep">
            FLĀMORÁ
          </p>

          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.75rem,7vw,6rem)] leading-[0.95]">
            Our Collections
          </h1>

          <p className="mt-7 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Discover fine jewellery shaped by timeless
            craftsmanship, considered materials and the
            unmistakable language of FLĀMORÁ.
          </p>
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-24">
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-2">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group block"
            >
              <article>
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/80">
                      {collection.tagline}
                    </p>

                    <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">
                      {collection.name}
                    </h2>
                  </div>
                </div>

                <div className="pt-5">
                  <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {collection.description}
                  </p>

                  <span className="mt-4 inline-block text-[11px] uppercase tracking-[0.2em] underline decoration-gold-deep underline-offset-4">
                    Explore collection
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}