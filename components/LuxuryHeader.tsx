"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

export default function LuxuryHeader({
  onInquire,
  onMenu,
}: {
  onInquire: () => void;
  onMenu: () => void;
}) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [last, setLast] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - last;
    if (latest < 90) setHidden(false);
    else if (delta > 8) setHidden(true);
    else if (delta < -8) setHidden(false);
    setLast(latest);
  });

  return (
    <motion.header
      animate={{ y: hidden ? "-115%" : "0%" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-[80] flex h-[84px] items-center justify-between px-[3vw] mix-blend-difference"
    >
      <div className="font-serif text-[clamp(28px,2.7vw,48px)] tracking-[-0.045em]">FLĀMORÁ & CO.</div>
      <div className="flex items-center gap-5">
        <button
          onClick={onInquire}
          className="h-11 min-w-[170px] rounded-full border border-white bg-transparent px-6 font-serif text-sm tracking-[0.16em] text-white transition hover:bg-white hover:text-black max-md:min-w-[120px]"
        >
          INQUIRE
        </button>
        <button onClick={onMenu} aria-label="Open menu" className="group relative h-11 w-[58px] bg-transparent">
          <span className="absolute right-0 top-[14px] h-px w-[54px] bg-white transition-transform duration-300 group-hover:-translate-x-2" />
          <span className="absolute right-0 top-[29px] h-px w-[54px] bg-white transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </motion.header>
  );
}
