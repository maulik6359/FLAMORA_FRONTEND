"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { IMAGES } from "@/data/images";

const pillars = [
  {
    title: "Hand-finished",
    body: "Every piece is polished, set and inspected by hand in our Melbourne atelier — never outsourced, never rushed.",
  },
  {
    title: "Ethically sourced",
    body: "Fully traceable stones and 100% recycled precious metals, with certification supplied for every diamond above 0.3ct.",
  },
  {
    title: "Designed to last",
    body: "We design against trend cycles. Solid gold, no plating, and complimentary re-polishing for the life of the piece.",
  },
];

export function BrandStory() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal className="">
          <p className="eyebrow">Our Craft</p>

          <h2 className="mt-5 font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.02]">
            Three days,
            <span className="block italic text-gold-deep">
              one pair of hands
            </span>
          </h2>

          <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
            FLĀMORÁ began in a single room above a
            laneway in Fitzroy, with one bench, one
            jeweller and a conviction that fine
            jewellery had become far too loud. We still
            work the same way — slowly, deliberately,
            and only with materials we can trace back
            to their source.
          </p>

          <div className="mt-12 flex flex-col divide-y divide-border border-y border-border">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="py-6"
              >
                <h3 className="font-display text-2xl">
                  {pillar.title}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="link-underline mt-10 inline-block text-[11px] uppercase tracking-[0.24em]"
          >
            Read our story
          </Link>
        </Reveal>

        <motion.div
          initial={{
            clipPath: "inset(0 0 100% 0)",
          }}
          whileInView={{
            clipPath: "inset(0 0 0% 0)",
          }}
          viewport={{
            once: true,
            margin: "-80px",
          }}
          transition={{
            duration: 1.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative min-h-[600px] overflow-hidden lg:sticky lg:top-28 lg:h-[80vh]"
        >
          <Image
            src={IMAGES.atelier}
            alt="A jeweller hand-polishing a gold ring at the FLĀMORÁ atelier bench"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}