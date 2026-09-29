"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { menuItems } from "@/data/site";

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export default function MenuOverlay({
  open,
  onClose,
}: MenuOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] bg-black text-white"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.82),rgba(0,0,0,.82)),url('/assets/emerald-ring.jpg')] bg-contain bg-center bg-no-repeat opacity-60" />

          {/* Header */}
          <div className="relative z-10 flex h-[86px] items-center justify-between px-[3vw]">
            <Link
              href="/"
              onClick={onClose}
              className="font-serif text-[clamp(28px,2.7vw,48px)] tracking-[-0.045em]"
            >
              FLĀMORÁ & CO.
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="relative h-14 w-14"
            >
              <span className="absolute left-2 right-2 top-7 h-px rotate-45 bg-white" />
              <span className="absolute left-2 right-2 top-7 h-px -rotate-45 bg-white" />
            </button>
          </div>

          {/* Menu */}
          <div className="relative z-10 grid h-[calc(100vh-86px)] place-items-center px-6 pb-10 text-center">
            <div>
              {menuItems.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`block font-serif text-[clamp(58px,7vw,118px)] leading-[0.92] tracking-[-0.045em] transition-colors duration-300 hover:text-white ${
                    index === 0 ? "text-white" : "text-white/25"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/three"
                onClick={onClose}
                className="mt-7 inline-block border-b border-white pb-2 text-[10px] tracking-[0.28em]"
              >
                EXPLORE 3D JEWEL ↗
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}