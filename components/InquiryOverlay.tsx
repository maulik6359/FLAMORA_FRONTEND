"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { api } from "@/lib/api";

const fields = [
  { name: "firstName", label: "FIRST NAME*", required: true, autoComplete: "given-name" },
  { name: "lastName", label: "LAST NAME*", required: true, autoComplete: "family-name" },
  { name: "email", label: "YOUR EMAIL ADDRESS*", required: true, type: "email", autoComplete: "email" },
  { name: "phone", label: "YOUR PHONE NUMBER", type: "tel", autoComplete: "tel" },
  { name: "country", label: "COUNTRY*", required: true, autoComplete: "country-name" },
  { name: "message", label: "YOUR MESSAGE", multiline: true },
];
const romans = ["I.", "II.", "III.", "IV.", "V.", "VI."];

export default function InquiryOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [busy, setBusy] = useState(false);

  // Sent as a contact message; it's only confirmed once the API has stored it.
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const value = (name: string) => String(new FormData(form).get(name) ?? "").trim();
    setBusy(true);
    try {
      await api.contact({
        name: `${value("firstName")} ${value("lastName")}`.trim(),
        email: value("email"),
        phone: value("phone"),
        subject: `Private enquiry (${value("country")})`,
        message: value("message") || "Private enquiry",
      });
      toast.success("Enquiry sent", { description: "Our atelier will contact you shortly." });
      form.reset();
      onClose();
    } catch (err: any) {
      toast.error("Your enquiry wasn't sent", { description: err?.message || "Please try again in a moment." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }} role="dialog" aria-modal="true" aria-labelledby="inquiry-title" className="fixed inset-0 z-[130] grid grid-cols-[1.05fr_.95fr] bg-black max-md:grid-cols-1">
          <div className="hide-scrollbar overflow-y-auto border-r border-white/15 px-[4vw] pb-[5vh] pt-[3vh] max-md:border-0 max-md:px-6">
            <div className="flex h-[70px] items-center justify-between">
              <div className="font-serif text-[clamp(24px,2.5vw,44px)]">FLĀMORÁ & CO.</div>
              <button type="button" onClick={onClose} aria-label="Close enquiry form" autoFocus className="relative h-14 w-14"><span className="absolute left-2 right-2 top-7 h-px rotate-45 bg-white" /><span className="absolute left-2 right-2 top-7 h-px -rotate-45 bg-white" /></button>
            </div>
            <h2 id="inquiry-title" className="my-[5vh] font-serif text-[clamp(56px,8vw,138px)] font-normal leading-[.9]">INQUIRE</h2>
            <p className="-mt-[2vh] mb-[3vh] max-w-[460px] text-[13px] leading-[1.8] text-neutral-400">
              Bespoke commissions, private viewings and collection questions. Our atelier replies personally. Fields marked * are required.
            </p>
            <form onSubmit={onSubmit}>
            {fields.map((field, i) => (
              <label key={field.name} className="group grid grid-cols-[42px_1fr] items-end gap-2 border-b border-white/35 py-5 transition-colors focus-within:border-white">
                <span className="font-serif text-lg text-neutral-500 transition-colors group-focus-within:text-white" aria-hidden="true">{romans[i]}</span>
                {field.multiline ? (
                  <textarea name={field.name} aria-label={field.label} rows={2} placeholder={field.label} className="resize-none bg-transparent pb-1 font-serif text-[clamp(20px,2vw,34px)] text-white outline-none placeholder:text-white/40" />
                ) : (
                  <input name={field.name} aria-label={field.label} type={field.type ?? "text"} required={field.required} autoComplete={field.autoComplete} placeholder={field.label} className="bg-transparent pb-1 font-serif text-[clamp(20px,2vw,34px)] text-white outline-none placeholder:text-white/40" />
                )}
              </label>
            ))}
            <button type="submit" disabled={busy} className="mt-8 h-14 w-full bg-white text-[10px] tracking-[0.24em] text-black transition hover:bg-white/80 disabled:cursor-wait disabled:opacity-60">{busy ? "SENDING…" : "SEND PRIVATE ENQUIRY"}</button>
            </form>
          </div>
          <div className="relative overflow-hidden bg-[#030303] max-md:hidden">
            <img src="/assets/emerald-ring.jpg" alt="FLĀMORÁ emerald ring" className="h-full w-full object-contain brightness-[.72]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
