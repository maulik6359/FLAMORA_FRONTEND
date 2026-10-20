"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { menuItems, secondaryMenuItems } from "@/data/site";

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
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
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
              autoFocus
              className="relative h-14 w-14"
            >
              <span className="absolute left-2 right-2 top-7 h-px rotate-45 bg-white" />
              <span className="absolute left-2 right-2 top-7 h-px -rotate-45 bg-white" />
            </button>
          </div>

          {/* Menu */}
          <nav
            aria-label="Main"
            className="hide-scrollbar relative z-10 grid h-[calc(100dvh-86px)] place-items-center overflow-y-auto px-6 pb-10 text-center"
          >
            <div>
              {menuItems.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`block font-serif text-[clamp(44px,7vw,118px)] leading-[0.95] tracking-[-0.045em] transition-colors duration-300 hover:text-white focus-visible:text-white ${
                    index === 0 ? "text-white" : "text-white/45"
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

              <ul className="mx-auto mt-10 flex max-w-[620px] flex-wrap justify-center gap-x-7 gap-y-3 border-t border-white/15 pt-7 text-[10px] tracking-[0.24em] text-white/70">
                {secondaryMenuItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={onClose} className="transition-colors hover:text-white focus-visible:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}