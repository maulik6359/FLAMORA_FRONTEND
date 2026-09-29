"use client";

import { AnimatePresence, motion } from "framer-motion";

const fields = ["FIRST NAME*", "LAST NAME*", "YOUR EMAIL ADDRESS*", "YOUR PHONE NUMBER", "COUNTRY*", "YOUR MESSAGE"];
const romans = ["I.", "II.", "III.", "IV.", "V.", "VI."];

export default function InquiryOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-[130] grid grid-cols-[1.05fr_.95fr] bg-black max-md:grid-cols-1">
          <div className="hide-scrollbar overflow-y-auto border-r border-white/15 px-[4vw] pb-[5vh] pt-[3vh] max-md:border-0 max-md:px-6">
            <div className="flex h-[70px] items-center justify-between">
              <div className="font-serif text-[clamp(28px,2.5vw,44px)]">FLĀMORÁ & CO.</div>
              <button onClick={onClose} className="relative h-14 w-14"><span className="absolute left-2 right-2 top-7 h-px rotate-45 bg-white" /><span className="absolute left-2 right-2 top-7 h-px -rotate-45 bg-white" /></button>
            </div>
            <h2 className="my-[5vh] font-serif text-[clamp(68px,8vw,138px)] font-normal leading-[.9]">INQUIRE</h2>
            {fields.map((field, i) => (
              <label key={field} className="grid grid-cols-[42px_1fr] items-end gap-2 border-b border-white/55 py-5">
                <span className="font-serif text-lg text-neutral-300">{romans[i]}</span>
                {i === 5 ? (
                  <textarea rows={2} placeholder={field} className="resize-none bg-transparent pb-1 font-serif text-[clamp(22px,2vw,34px)] text-white outline-none placeholder:text-white" />
                ) : (
                  <input placeholder={field} className="bg-transparent pb-1 font-serif text-[clamp(22px,2vw,34px)] text-white outline-none placeholder:text-white" />
                )}
              </label>
            ))}
            <button className="mt-8 h-14 w-full border border-white/60 text-[10px] tracking-[0.24em] transition hover:bg-white hover:text-black">SEND PRIVATE ENQUIRY</button>
          </div>
          <div className="relative overflow-hidden bg-[#030303] max-md:hidden">
            <img src="/assets/emerald-ring.jpg" alt="FLĀMORÁ emerald ring" className="h-full w-full object-contain brightness-[.72]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
