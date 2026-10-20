"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";

export default function VideoSection() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.08]);
  const radius = useTransform(scrollYProgress, [0, 0.65, 1], [24, 10, 0]);

  // `paused` follows the video's own play/pause events, so it stays right when the
  // browser blocks autoplay (e.g. low-power mode).
  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setPaused(true));
    else video.pause();
  }

  return (
    <section ref={ref} className="relative h-[185vh] bg-[#030303]">
      <div className="sticky top-0 h-screen overflow-hidden px-[4vw] py-[8vh] max-md:px-5">
        <div className="absolute left-[5vw] right-[5vw] top-[9vh] z-20 flex items-end justify-between gap-8 max-md:block">
          <div>
            <div className="text-[9px] tracking-[0.3em] text-neutral-400">INTERACTIVE OBJECT · 02</div>
            <h2 className="mt-3 font-serif text-[clamp(54px,6vw,94px)] font-normal leading-[0.95]">THE JEWEL<br />IN MOTION.</h2>
          </div>
          <p className="max-w-[390px] text-xs leading-[1.8] text-neutral-400 max-md:mt-4">
            A cinematic study of reflection, movement and proportion — the jewel as it is meant to be seen: in motion, in light.
          </p>
        </div>

        <motion.div style={{ scale, borderRadius: radius }} className="absolute inset-x-[4vw] bottom-[4vh] top-[28vh] overflow-hidden bg-neutral-900 max-md:top-[40vh]">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onPlay={() => setPaused(false)}
            onPause={() => setPaused(true)}
            aria-label="FLĀMORÁ jewellery film"
            className="h-full w-full object-cover brightness-[.8] contrast-105"
          >
            <source src="/media/flamora.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/10" />
          <button
            type="button"
            onClick={toggle}
            aria-label={paused ? "Play film" : "Pause film"}
            className="absolute bottom-5 right-5 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/75 bg-black/30 text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
          >
            {paused ? <Play className="h-4 w-4 translate-x-px" strokeWidth={1.5} /> : <Pause className="h-4 w-4" strokeWidth={1.5} />}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
