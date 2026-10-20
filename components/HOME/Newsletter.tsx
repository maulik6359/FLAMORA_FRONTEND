"use client"

import { useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api";

import { Reveal } from "@/components/motion/Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await api.subscribeNewsletter({ email, source: "homepage" });
      setEmail("");
      toast("Welcome to FLĀMORÁ", {
        description: "You're on the list for private previews.",
      });
    } catch (err) {
      setError(err?.message || "We couldn't subscribe you just now. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-ink text-ivory">
      <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 lg:py-28">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow text-gold">Private List</p>
          <h2 className="mt-6 font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight">
            Enter the World of FLĀMORÁ
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ivory/65">
            Early access to limited editions, atelier notes and invitations to
            private viewings in Melbourne and Sydney.
          </p>
          <form onSubmit={submit} noValidate className="mx-auto mt-10 max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "newsletter-error" : undefined}
                className="min-w-0 flex-1 border-b border-ivory/30 bg-transparent px-1 py-3 text-sm placeholder:text-ivory/35 focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy}
                className="shrink-0 bg-gold disabled:opacity-60 px-8 py-3.5 text-[11px] tracking-[0.28em] uppercase text-ink transition-opacity hover:opacity-88"
              >
                Subscribe
              </button>
            </div>
            {error && (
              <p id="newsletter-error" role="alert" className="mt-3 text-left text-xs text-gold">
                {error}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}