"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Reveal } from "@/components/motion/Reveal";
import { IMAGES } from "@/data/images";

export function FeaturedCollection() {
  return (
    <section className="bg-silk/40">
      <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-4 py-20 md:px-8 lg:grid-cols-2 lg:gap-20 lg:py-32">
        <motion.div
          initial={{
            clipPath: "inset(12% 12% 12% 12%)",
            opacity: 0,
          }}
          whileInView={{
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
          }}
          viewport={{
            once: true,
            margin: "-100px",
          }}
          transition={{
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden"
        >
          <img
            src={IMAGES.ring3}
            alt="Verde emerald ring on an ivory pedestal"
            width={912}
            height={1104}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
        </motion.div>

        <Reveal className="">
          <p className="eyebrow">
            Collection No. 03
          </p>

          <h2 className="mt-5 font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.02]">
            Verdant

            <span className="block italic text-gold-deep">
              Colombian emeralds
            </span>
          </h2>

          <div className="rule-gold mt-8 max-w-24 opacity-70" />

          <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
            A study in green. Traceable Colombian
            emeralds, cut to hold as much colour as
            light, set against high-polish platinum
            and warm eighteen carat gold. Each stone
            is selected in person, then set by a
            single jeweller from first claw to final
            polish.
          </p>

          <dl className="mt-10 grid max-w-md grid-cols-2 gap-6 border-t border-border pt-8">
            <div>
              <dt className="eyebrow">
                Origin
              </dt>

              <dd className="mt-2 font-display text-2xl">
                Muzo, Colombia
              </dd>
            </div>

            <div>
              <dt className="eyebrow">
                Pieces
              </dt>

              <dd className="mt-2 font-display text-2xl">
                Two, limited
              </dd>
            </div>
          </dl>

          <Link
            href="/collections/verdant"
            className="mt-10 inline-block bg-ink px-9 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory transition-opacity hover:opacity-90"
          >
            Shop the Collection
          </Link>
        </Reveal>
      </div>
    </section>
  );
}