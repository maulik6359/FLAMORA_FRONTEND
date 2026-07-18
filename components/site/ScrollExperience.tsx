"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Link from "next/link";

/**
 * FLAMORA — ScrollExperience
 * A cinematic, GPU-accelerated scroll-driven sequence used just below the hero.
 * Uses Framer Motion's useScroll + useTransform (CSS transforms only — no Three.js
 * or WebGL required). Pairs with the site-wide Lenis smooth scroll for the
 * inertia-feel the user asked for.
 *
 * Layout: 300vh sticky container. Inside, a single pinned viewport that reveals
 * three scenes as the user scrolls — a jewel drift, a craftsmanship close-up,
 * and a final "chapter card" reveal that hands off to the featured collection.
 */

function useSceneRange(progress: MotionValue<number>, start: number, end: number) {
  const eased = useTransform(progress, [start, (start + end) / 2, end], [0, 1, 0]);
  return eased;
}

export function ScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // Global camera-like transforms
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [0.55, 0.55, 0.1]);

  // Scene opacities (three overlapping bands)
  const scene1 = useSceneRange(scrollYProgress, 0.0, 0.4);
  const scene2 = useSceneRange(scrollYProgress, 0.3, 0.7);
  const scene3 = useSceneRange(scrollYProgress, 0.6, 1.0);

  // Jewel drift (scene 1) — floats and rotates as user scrolls
  const jewelY = useTransform(scrollYProgress, [0, 0.4], ["10%", "-15%"]);
  const jewelRotate = useTransform(scrollYProgress, [0, 0.4], [-8, 12]);
  const jewelScale = useTransform(scrollYProgress, [0, 0.4], [0.9, 1.15]);

  // Scene 2 — split image reveal
  const leftX = useTransform(scrollYProgress, [0.3, 0.65], ["-20%", "0%"]);
  const rightX = useTransform(scrollYProgress, [0.3, 0.65], ["20%", "0%"]);

  // Scene 3 — chapter card scale-in
  const cardScale = useTransform(scrollYProgress, [0.6, 0.9], [0.7, 1]);

  // Progress bar
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="relative bg-ivory"
      style={{ height: "300vh" }}
      data-testid="scroll-experience"
    >
      {/* Sticky pinned viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Cinematic background — soft emerald bokeh, parallax + gentle zoom */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: bgScale, y: bgY, opacity: bgOpacity }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=2400&q=90')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ivory/40 via-ivory/70 to-ivory" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(201,169,97,0.18),transparent_55%)]" />
        </motion.div>

        {/* Ambient gold particles (CSS-only, no re-render churn) */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute block h-1 w-1 rounded-full bg-gold"
              style={{
                left: `${(i * 47) % 100}%`,
                top: `${(i * 71) % 100}%`,
                filter: "blur(1.5px)",
              }}
              animate={{ y: [0, -24, 0], opacity: [0.25, 0.9, 0.25] }}
              transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.35 }}
            />
          ))}
        </div>

        {/* ── SCENE 1 · The Stone Drifts ─────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 grid place-items-center px-6"
          style={{ opacity: scene1 }}
        >
          <div className="grid lg:grid-cols-12 items-center gap-10 max-w-[1300px] w-full">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <p className="eyebrow text-gold">◆ Chapitre I</p>
              <h2 className="mt-6 font-display text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[0.98] text-emerald-vault">
                A stone <em className="gold-text not-italic">chosen</em>
                <span className="block">by hand.</span>
              </h2>
              <div className="hairline mt-6 w-24" />
              <p className="mt-6 max-w-md text-onyx/70 font-light leading-relaxed">
                Somewhere between the mines of Muzo and a candlelit atelier in Place Vendôme,
                a single emerald begins its transformation.
              </p>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 relative aspect-square max-w-[560px] mx-auto w-full">
              <motion.div
                className="absolute inset-0"
                style={{ y: jewelY, rotate: jewelRotate, scale: jewelScale }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=90"
                  alt="A single emerald"
                  className="h-full w-full object-cover shadow-[0_40px_120px_-30px_rgba(4,71,28,0.35)]"
                />
                <div className="absolute inset-0 ring-1 ring-gold/40" />
              </motion.div>
              <div className="absolute -bottom-4 -left-4 hidden md:block bg-ivory border border-gold/40 px-5 py-3">
                <p className="text-[9px] tracking-[0.4em] uppercase text-onyx/50">Colombie</p>
                <p className="font-display italic text-2xl text-emerald-vault">Muzo · 4.2 ct</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── SCENE 2 · The Setting ──────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 grid place-items-center px-6"
          style={{ opacity: scene2 }}
        >
          <div className="grid lg:grid-cols-12 gap-8 max-w-[1300px] w-full items-center">
            <motion.div
              className="lg:col-span-4 relative aspect-[3/4] overflow-hidden"
              style={{ x: leftX }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=90"
                alt="Master jeweller at work"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-gold/30" />
            </motion.div>

            <div className="lg:col-span-4 text-center">
              <p className="eyebrow text-gold">◆ Chapitre II</p>
              <h2 className="mt-6 font-display text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.02] text-emerald-vault">
                Set by <em className="gold-text not-italic">candlelight.</em>
              </h2>
              <div className="hairline mt-6 mx-auto w-16" />
              <p className="mt-6 text-onyx/70 font-light leading-relaxed max-w-sm mx-auto">
                Forty-eight hours. Two hundred prong adjustments. A single signature engraved
                where only the wearer will ever find it.
              </p>
            </div>

            <motion.div
              className="lg:col-span-4 relative aspect-[3/4] overflow-hidden"
              style={{ x: rightX }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1583937443351-c58436a95bd8?auto=format&fit=crop&w=900&q=90"
                alt="Finished piece"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-gold/30" />
            </motion.div>
          </div>
        </motion.div>

        {/* ── SCENE 3 · Chapter Card Reveal ──────────────────────────────── */}
        <motion.div
          className="absolute inset-0 grid place-items-center px-6"
          style={{ opacity: scene3 }}
        >
          <motion.div
            className="relative w-full max-w-[900px] aspect-[16/9] bg-emerald-vault text-ivory overflow-hidden"
            style={{ scale: cardScale }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,97,0.25),transparent_60%)]" />
            <div className="absolute inset-0 ring-1 ring-gold/40" />
            <div className="relative h-full flex flex-col items-center justify-center text-center px-8">
              <p className="eyebrow text-gold">◆ Chapitre III · La Collection</p>
              <h2 className="mt-6 font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.95]">
                The <em className="gold-text not-italic italic">Vault</em>
                <span className="block">opens below.</span>
              </h2>
              <div className="hairline mt-6 w-24" />
              <p className="mt-6 max-w-md text-ivory/70 font-light">
                Nine pieces. Signed, numbered, kept under glass. Each one waiting for a
                single collector.
              </p>
              <Link
                href="/shop"
                className="mt-10 inline-block px-10 py-4 border border-gold text-ivory text-[11px] tracking-[0.4em] uppercase hover:bg-gold hover:text-emerald-vault transition"
                data-testid="scroll-experience-cta"
              >
                Enter the Vault
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress rail — bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-onyx/10">
          <motion.div
            className="h-full bg-gold origin-left"
            style={{ width: progressWidth }}
          />
        </div>
      </div>
    </section>
  );
}
