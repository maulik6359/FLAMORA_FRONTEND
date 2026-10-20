"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.24]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 0.5, 0.15]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(5px)"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  // The faded-out CTAs shouldn't still catch clicks.
  const copyPointer = useTransform(copyOpacity, (v) => (v < 0.15 ? "none" : "auto"));

  return (
    <section ref={ref} className="relative h-[200vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ scale, y, opacity, filter: blur }}
          className="absolute -inset-[8%] bg-cover bg-center"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(90deg,rgba(0,0,0,.78),rgba(0,0,0,.12) 58%,rgba(0,0,0,.28)),url('/assets/Ring.jpg')",
            }}
          />
        </motion.div>
        <motion.div
          style={{ y: copyY, opacity: copyOpacity, pointerEvents: copyPointer }}
          className="absolute bottom-[9vh] left-[5vw] right-[5vw] z-10"
        >
          <div className="mb-5 text-[10px] tracking-[0.3em] text-neutral-300">FLĀMORÁ & CO. · FINE JEWELLERY</div>
          <h1 className="font-serif text-[clamp(56px,10.5vw,170px)] font-normal leading-[0.82] tracking-[-0.055em]">
            DESIRE,<br />MADE VISIBLE.
          </h1>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 max-md:mt-7">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center gap-3 rounded-full bg-white px-7 text-[10px] tracking-[0.24em] text-black transition hover:bg-white/80"
            >
              EXPLORE THE COLLECTION <span aria-hidden="true">↗</span>
            </Link>
            <Link
              href="/contact?type=appointment"
              className="border-b border-white/60 pb-1 text-[10px] tracking-[0.24em] text-white transition hover:border-white"
            >
              BOOK A PRIVATE VIEWING
            </Link>
          </div>
        </motion.div>
        <motion.div
          style={{ opacity: copyOpacity }}
          aria-hidden="true"
          className="absolute bottom-[9vh] right-[5vw] z-10 flex flex-col items-center gap-3 text-[9px] tracking-[0.3em] text-neutral-300 max-md:hidden"
        >
          SCROLL
          <span className="relative h-14 w-px overflow-hidden bg-white/20">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-white"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
