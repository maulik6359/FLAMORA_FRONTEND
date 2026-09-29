"use client";

import { motion } from "framer-motion";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = async () => {
    const video = videoRef.current;

    if (!video) return;

    const nextMutedState = !isMuted;

    video.muted = nextMutedState;
    setIsMuted(nextMutedState);

    if (video.paused) {
      try {
        await video.play();
      } catch (error) {
        console.error("Video could not play:", error);
      }
    }
  };

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-black">
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/images/flamora.mp4"
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Dark overlay for readable text */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Luxury gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />

      {/* Sound button */}
      {/* <button
        type="button"
        onClick={toggleSound}
        className="absolute right-5 top-24 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/50 md:right-8 md:top-28"
        aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </button> */}

      {/* Hero content */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-5 py-32 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-white/80 sm:text-sm"
          >
            Timeless elegance
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-heading text-5xl leading-[0.95] text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Jewellery made
            <span className="mt-2 block italic text-[#d9bc78]">
              to be remembered
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-7 max-w-xl text-base leading-7 text-white/80 sm:text-lg"
          >
            Discover beautifully crafted jewellery designed to celebrate your
            most meaningful moments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 bg-white px-7 py-4 text-sm font-medium uppercase tracking-[0.15em] text-black transition hover:bg-[#d9bc78]"
            >
              Shop collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/collections"
              className="inline-flex items-center border border-white/50 px-7 py-4 text-sm font-medium uppercase tracking-[0.15em] text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10"
            >
              Explore collections
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/70 md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-white/80 to-transparent" />
      </motion.div>
    </section>
  );
}

export default Hero;