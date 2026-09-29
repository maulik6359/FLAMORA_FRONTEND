"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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
          style={{ y: copyY, opacity: copyOpacity }}
          className="absolute bottom-[9vh] left-[5vw] z-10"
        >
          <div className="mb-5 text-[10px] tracking-[0.3em] text-neutral-300">FLĀMORÁ & CO. · FINE JEWELLERY</div>
          <h1 className="font-serif text-[clamp(76px,10.5vw,170px)] font-normal leading-[0.82] tracking-[-0.055em]">
            DESIRE,<br />MADE VISIBLE.
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
