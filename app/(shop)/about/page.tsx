import { Benefits } from "@/components/HOME/Benefits";
import { BrandStory } from "@/components/HOME/BrandStory";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Atelier — FLĀMORÁ Jewellery",
  description:
    "Discover the FLĀMORÁ Melbourne atelier, our craftsmanship, traceable stones, recycled 18k gold and jewellery made slowly by hand.",
  openGraph: {
    title: "Our Atelier — FLĀMORÁ Jewellery",
    description:
      "Discover the FLĀMORÁ Melbourne atelier, our craftsmanship, traceable stones, recycled 18k gold and jewellery made slowly by hand.",
  },
};

const values = [
  {
    number: "01",
    title: "Made slowly",
    description:
      "We believe fine jewellery deserves time. Every piece is considered through proportion, stone selection, setting and final polish rather than rushed through production.",
  },
  {
    number: "02",
    title: "Materials with meaning",
    description:
      "We work with precious metals, carefully selected gemstones and considered sourcing so the material quality feels as enduring as the design.",
  },
  {
    number: "03",
    title: "Designed to remain",
    description:
      "Our pieces are created beyond seasonal trends. The goal is jewellery that feels relevant now, personal over time and worthy of being passed on.",
  },
];

const process = [
  {
    step: "01",
    title: "Stone selection",
    description:
      "Every design begins with the character of the stone — its colour, proportion, clarity and ability to hold light.",
  },
  {
    step: "02",
    title: "Design refinement",
    description:
      "Silhouettes are refined around balance, wearability and restraint so the final piece feels effortless rather than excessive.",
  },
  {
    step: "03",
    title: "Hand finishing",
    description:
      "Each surface, edge, setting and transition is carefully finished to achieve the polished, tactile quality expected of fine jewellery.",
  },
  {
    step: "04",
    title: "Final inspection",
    description:
      "Before a piece leaves the atelier, we inspect its setting, finish, symmetry and overall presentation.",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid min-h-[78svh] max-w-[1600px] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center px-4 py-20 md:px-8 lg:px-12 lg:py-28">
            <div className="max-w-3xl">
              <p className="eyebrow text-gold-deep">
                Est. 2014 · Melbourne
              </p>

              <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6.8rem)] leading-[0.92] tracking-[-0.03em]">
                Jewellery made
                <span className="block italic text-gold-deep">
                  to become part
                </span>
                of your story.
              </h1>

              <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
                FLĀMORÁ creates fine jewellery with a quiet sense of permanence.
                We focus on strong proportions, exceptional materials and careful
                craftsmanship so each piece can be worn today and treasured for
                years to come.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/collections"
                  className="bg-ink px-8 py-4 text-[11px] uppercase tracking-[0.26em] text-ivory transition-opacity hover:opacity-90"
                >
                  Explore Collections
                </Link>

                <Link
                  href="/shop"
                  className="border border-border px-8 py-4 text-[11px] uppercase tracking-[0.26em] transition-colors hover:border-gold-deep"
                >
                  Shop Jewellery
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-full">
            <Image
              src="/images/products/atelier.jpg"
              alt="FLĀMORÁ jewellery atelier"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 border border-white/20 bg-black/15 p-5 text-white backdrop-blur-sm md:bottom-8 md:left-8 md:right-auto md:max-w-sm">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/70">
                The Atelier
              </p>

              <p className="mt-2 font-display text-2xl">
                Melbourne, Australia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="eyebrow">
              Our Philosophy
            </p>
          </div>

          <div>
            <p className="max-w-4xl font-display text-[clamp(2rem,4.5vw,4rem)] leading-[1.08]">
              We believe luxury is not about excess. It is about material,
              proportion, precision and the feeling that every detail has been
              considered.
            </p>

            <div className="mt-10 grid gap-8 text-sm leading-7 text-muted-foreground md:grid-cols-2">
              <p>
                Our jewellery is designed with restraint — clean lines, balanced
                silhouettes and stones chosen for character rather than spectacle
                alone. Every decision is intended to make the piece easier to
                wear, easier to keep and harder to forget.
              </p>

              <p>
                Rather than building collections around short-lived trends, we
                focus on forms that can evolve with the person wearing them. A
                piece should feel meaningful on its first day and even more
                personal years later.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY COMPONENT */}
      <BrandStory />

      {/* VALUES */}
      <section className="border-y border-border bg-silk/30">
        <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow">
              What guides us
            </p>

            <h2 className="mt-5 font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-none">
              Considered from the
              <span className="block italic text-gold-deep">
                first sketch.
              </span>
            </h2>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.number}
                className="border-t border-border pt-6"
              >
                <span className="text-xs tracking-[0.22em] text-gold-deep">
                  {value.number}
                </span>

                <h3 className="mt-5 font-display text-3xl">
                  {value.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MATERIALS */}
      <section className="mx-auto grid max-w-[1600px] gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:gap-20">
        <div className="relative min-h-[520px] overflow-hidden">
          <Image
            src="/images/products/campaign.jpg"
            alt="Fine jewellery materials and craftsmanship"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex items-center">
          <div>
            <p className="eyebrow">
              Materials
            </p>

            <h2 className="mt-5 font-display text-[clamp(2.5rem,5vw,4.7rem)] leading-[1.02]">
              Precious materials,
              <span className="block italic text-gold-deep">
                chosen with intention.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground">
              The quality of a finished piece begins long before setting and
              polishing. We select metals and gemstones for their visual
              character, durability and ability to age beautifully.
            </p>

            <dl className="mt-10 divide-y divide-border border-y border-border">
              <div className="grid grid-cols-[120px_1fr] gap-6 py-5">
                <dt className="eyebrow">
                  Gold
                </dt>
                <dd className="text-sm leading-6 text-muted-foreground">
                  18k yellow, white and rose gold selected for richness of tone
                  and everyday durability.
                </dd>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-6 py-5">
                <dt className="eyebrow">
                  Platinum
                </dt>
                <dd className="text-sm leading-6 text-muted-foreground">
                  Chosen for selected designs where strength, weight and a cool
                  white finish best support the stone.
                </dd>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-6 py-5">
                <dt className="eyebrow">
                  Stones
                </dt>
                <dd className="text-sm leading-6 text-muted-foreground">
                  Diamonds, emeralds, sapphires and pearls selected individually
                  for beauty, proportion and visual presence.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-ink text-ivory">
        <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="eyebrow text-gold">
                Our Process
              </p>

              <h2 className="mt-5 font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[1.02]">
                From stone
                <span className="block italic text-gold">
                  to final polish.
                </span>
              </h2>
            </div>

            <div className="divide-y divide-white/15 border-y border-white/15">
              {process.map((item) => (
                <article
                  key={item.step}
                  className="grid gap-4 py-7 sm:grid-cols-[70px_180px_1fr] sm:items-start"
                >
                  <span className="text-xs tracking-[0.2em] text-gold">
                    {item.step}
                  </span>

                  <h3 className="font-display text-xl">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-7 text-white/65">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 px-4 py-14 md:grid-cols-4 md:px-8">
          <div className="border-r border-border p-6 text-center">
            <p className="font-display text-4xl md:text-5xl">
              2014
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Established
            </p>
          </div>

          <div className="p-6 text-center md:border-r md:border-border">
            <p className="font-display text-4xl md:text-5xl">
              18k
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Fine Gold
            </p>
          </div>

          <div className="border-r border-border border-t p-6 text-center md:border-t-0">
            <p className="font-display text-4xl md:text-5xl">
              01
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Melbourne Atelier
            </p>
          </div>

          <div className="border-t p-6 text-center md:border-t-0">
            <p className="font-display text-4xl md:text-5xl">
              ∞
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Made To Endure
            </p>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <Benefits />

      {/* CTA */}
      <section className="mx-auto max-w-[1600px] px-4 py-24 text-center md:px-8 md:py-32">
        <p className="eyebrow text-gold-deep">
          Discover FLĀMORÁ
        </p>

        <h2 className="mx-auto mt-5 max-w-4xl font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98]">
          Find the piece that becomes
          <span className="block italic text-gold-deep">
            part of your own story.
          </span>
        </h2>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/shop"
            className="bg-ink px-9 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory transition-opacity hover:opacity-90"
          >
            Shop Jewellery
          </Link>

          <Link
            href="/collections"
            className="border border-border px-9 py-4 text-[11px] uppercase tracking-[0.28em] transition-colors hover:border-gold-deep"
          >
            View Collections
          </Link>
        </div>
      </section>
    </main>
  );
}