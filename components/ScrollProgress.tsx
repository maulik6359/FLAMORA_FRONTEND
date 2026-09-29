"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.25 });
  return <motion.div style={{ scaleX }} className="fixed left-0 top-0 z-[200] h-[2px] w-full origin-left bg-white" />;
}
