"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { philosophySteps } from "@/data/site";

export default function PhilosophySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1.17]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "3%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 0.65, 0.22]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStep(Math.min(3, Math.floor(v * 4)));
  });

  const active = philosophySteps[step];

  return (
    <section ref={ref} className="relative h-[390vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ scale, y }}
          className="absolute -inset-[5%] bg-contain bg-center bg-no-repeat"
        >
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/assets/beyond.png')" }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_46%,transparent_0_20%,rgba(0,0,0,.18)_50%,rgba(0,0,0,.72)_100%),linear-gradient(90deg,rgba(0,0,0,.76),rgba(0,0,0,.05)_45%,rgba(0,0,0,.52))]" />

        <motion.div style={{ opacity: titleOpacity }} className="absolute left-1/2 top-[11vh] z-10 w-[92vw] max-w-[1400px] -translate-x-1/2 text-center">
          <div className="text-[9px] tracking-[0.32em] text-neutral-400">THE FLĀMORÁ PHILOSOPHY</div>
          <h2 className="mt-6 font-serif text-[clamp(66px,8.8vw,146px)] font-normal leading-[0.86] tracking-[-0.05em]">
            BEYOND<br /><span className="text-white/30">POSSIBILITY.</span>
          </h2>
        </motion.div>

        <div className="absolute inset-0 z-20 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.article
              key={step}
              initial={{ opacity: 0, y: 55 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -35 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute w-[min(470px,38vw)] max-md:w-[78vw] ${
                step === 0
                  ? "bottom-[10vh] left-[5.5vw] max-md:left-6"
                  : step === 1
                    ? "right-[5.5vw] top-[20vh] max-md:right-6"
                    : step === 2
                      ? "bottom-[10vh] right-[7vw] max-md:right-6"
                      : "left-[6vw] top-[21vh] max-md:left-6"
              }`}
            >
              <div className="text-[9px] tracking-[0.28em] text-neutral-400">{active.eyebrow}</div>
              <h3 className="my-[18px] font-serif text-[clamp(36px,3.8vw,64px)] font-normal leading-[0.98]">{active.title}</h3>
              <p className="max-w-[390px] text-[13px] leading-[1.8] text-neutral-300">{active.body}</p>
              <div className="mt-6 h-px w-[72px] bg-white" />
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="absolute right-[2.4vw] top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-[22px]">
          {philosophySteps.map((_, i) => (
            <span key={i} className={`h-[11px] w-[11px] rounded-full border border-white/70 ${i === step ? "bg-white" : "bg-transparent"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
