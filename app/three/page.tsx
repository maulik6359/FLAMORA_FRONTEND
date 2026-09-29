"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const JewelScene = dynamic(() => import("@/components/three/JewelScene"), { ssr: false });

export default function ThreePage() {
  return (
    <main className="grid min-h-screen grid-cols-[.72fr_1.28fr] items-center bg-[radial-gradient(circle_at_70%_50%,rgba(20,105,77,.28),transparent_30%),#030504] px-[6vw] py-[8vh] text-white max-md:grid-cols-1">
      <section className="relative z-10 max-w-[560px]">
        <div className="text-[9px] tracking-[0.3em] text-neutral-400">THREE.JS OBJECT · 01</div>
        <h1 className="my-6 font-serif text-[clamp(58px,7vw,118px)] font-normal leading-[.9] tracking-[-.045em]">THE JEWEL,<br />IN REAL TIME.</h1>
        <p className="max-w-[430px] text-[13px] leading-[1.8] text-neutral-400">Move your cursor across the object. Gold, gemstone depth, light and rotation are rendered live using Three.js and React Three Fiber.</p>
        <Link href="/" className="mt-10 inline-block border-b border-white pb-2 text-[10px] tracking-[0.26em]">← RETURN TO STORY</Link>
      </section>
      <section className="h-[88vh] min-h-[620px] max-md:h-[60vh] max-md:min-h-[440px]">
        <JewelScene />
      </section>
    </main>
  );
}
