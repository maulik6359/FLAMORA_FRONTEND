"use client";

import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

import { IMAGES } from "@/data/images";

export default function CampaignBanner() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["-8%", "8%"],
  );

  return (
    <section
      ref={ref}
      className="relative h-[85svh] min-h-[520px] overflow-hidden"
    >
      <motion.img
        style={{ y }}
        src={IMAGES.campaign}
        alt="Model wearing the Seraphine diamond collar"
        width={1920}
        height={1008}
        loading="lazy"
        className="absolute inset-0 size-full scale-110 object-cover"
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.2_0.02_160_/_0.68),oklch(0.2_0.02_160_/_0.15)_60%,transparent)]" />

      <div className="relative mx-auto flex h-full max-w-[1600px] items-center px-4 md:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            filter: "blur(10px)",
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          viewport={{
            once: true,
            margin: "-100px",
          }}
          transition={{
            duration: 1.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-lg"
        >
          <p className="eyebrow text-gold">
            Soirée · Summer Editions
          </p>

          <h2 className="mt-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] text-ivory">
            Made for the
            <span className="block italic">
              candlelit hours
            </span>
          </h2>

          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/75">
            Garland collars, articulated diamond lines and
            pavé cuffs — released in runs of five, never
            repeated.
          </p>

          <Link
            href="/collections/soiree"
            className="mt-9 inline-block border border-ivory/50 px-9 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory transition-colors hover:bg-ivory hover:text-ink"
          >
            View the Edition
          </Link>
        </motion.div>
      </div>
    </section>
  );
}