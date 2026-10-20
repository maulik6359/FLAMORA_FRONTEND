"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { makingSteps } from "@/data/site";
import { scrollToSectionProgress } from "@/lib/utils";

export default function MakingSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStep(Math.min(2, Math.floor(v * 3)));
  });

  const active = makingSteps[step];

  return (
    <section ref={ref} className="relative h-[340vh] bg-[#080808]">
      <div className="sticky top-0 grid h-screen grid-cols-[.78fr_1.22fr] items-center gap-[6vw] overflow-hidden px-[5vw] py-[8vh] max-md:grid-cols-1 max-md:px-6">
        <div className="relative z-20 max-w-[560px] max-md:absolute max-md:bottom-[5vh] max-md:left-6 max-md:right-6 max-md:max-w-none max-md:[text-shadow:0_2px_30px_#000]">
          <div className="text-[9px] tracking-[0.3em] text-neutral-400">THE MAKING OF AN ICON · CHAPTER 0{step + 1}</div>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
              <h2 className="my-6 font-serif text-[clamp(58px,6.8vw,110px)] font-normal leading-[0.9] tracking-[-0.045em]">{active.title}</h2>
              <p className="max-w-[440px] text-[13px] leading-[1.8] text-neutral-400">{active.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative h-[86vh] overflow-hidden max-md:h-[80vh]">
          <AnimatePresence mode="sync">
            <motion.img
              key={active.image}
              src={active.image}
              alt={active.title}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10" />
          {/* On mobile the copy sits over the image, so darken its lower half for legibility. */}
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/50 to-transparent md:hidden" />
          <div className="absolute bottom-[3.5vh] right-[3.5vw] z-10 text-right text-[9px] tracking-[0.25em] text-white max-md:bottom-auto max-md:right-4 max-md:top-4">
            <div>{active.caption}</div>
            <nav aria-label="Making of chapters" className="mt-3 flex justify-end gap-2">
              {makingSteps.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToSectionProgress(ref.current, (i + 0.1) / makingSteps.length)}
                  aria-label={`Go to chapter ${s.caption}`}
                  aria-current={i === step ? "step" : undefined}
                  className="group py-2"
                >
                  <span className="relative block h-px w-[52px] overflow-hidden bg-white/25 transition-[height] group-hover:h-[3px] max-md:w-9">
                    <motion.i className="absolute inset-0 bg-white" animate={{ scaleX: i <= step ? 1 : 0 }} style={{ transformOrigin: "left" }} />
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
