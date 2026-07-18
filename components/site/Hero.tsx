"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-ivory pt-20"
      data-testid="hero"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2200&q=90')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/80 via-ivory/50 to-ivory" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(4,71,28,0.08)_100%)]" />
      </div>

      {/* Floating gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-gold"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              filter: "blur(1px)",
            }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 h-[calc(100vh-5rem)] grid place-items-center">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="eyebrow text-gold"
          >
            ◆ Maison Depuis 1924 · Paris ◆
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] text-emerald-vault"
          >
            The Light of
            <span className="block gold-text italic mt-2">Éternité</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="hairline mx-auto w-32 mt-8"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="mt-8 max-w-xl mx-auto font-light text-lg text-onyx/70 leading-relaxed"
          >
            Colombian emeralds. Ceylon sapphires. Diamonds cut by hand.
            <br />Every piece signed beneath the band — inherited, never announced.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.3 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/shop"
              className="group px-10 py-4 bg-emerald-vault text-ivory text-[11px] tracking-[0.4em] uppercase hover:bg-emerald transition-all hover:shadow-gold"
              data-testid="hero-cta-shop"
            >
              Enter the Maison
            </Link>
            <Link
              href="/about"
              className="px-10 py-4 border border-gold/50 text-onyx text-[11px] tracking-[0.4em] uppercase hover:bg-gold/10 hover:border-gold transition"
              data-testid="hero-cta-story"
            >
              The Story
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
        <p className="eyebrow text-onyx/40">Scroll · Défiler</p>
        <motion.div
          className="mx-auto mt-3 h-10 w-px bg-gold/50"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </section>
  );
}
