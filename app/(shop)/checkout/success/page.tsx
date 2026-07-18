"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth, useCart } from "@/lib/store";
import { api, formatPrice } from "@/lib/api";

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { token } = useAuth();
  const cart = useCart();
  const [state, setState] = useState<{ kind: "loading" | "paid" | "failed"; orderId?: string; amount?: number; currency?: string; reason?: string }>({ kind: "loading" });
  const finalized = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setState({ kind: "failed", reason: "Missing session" });
      return;
    }
    if (!token) return;

    let cancelled = false;
    let attempts = 0;
    const poll = async () => {
      try {
        const s = await api.checkoutStatus(sessionId, token);
        if (cancelled) return;
        if (s.paymentStatus === "paid") {
          if (!finalized.current) {
            finalized.current = true;
            cart.clear();
            try { sessionStorage.removeItem("flamora.pending_order"); } catch {}
          }
          setState({ kind: "paid", orderId: s.orderId, amount: s.amount, currency: s.currency });
          return;
        }
        if (s.status === "expired" || s.paymentStatus === "failed") {
          setState({ kind: "failed", reason: "Payment was not completed" });
          return;
        }
        attempts++;
        if (attempts >= 12) return setState({ kind: "failed", reason: "Timed out waiting for confirmation" });
        setTimeout(poll, 2000);
      } catch (e: any) {
        setState({ kind: "failed", reason: e.message || "Status check failed" });
      }
    };
    poll();
    return () => { cancelled = true; };
  }, [sessionId, token, cart]);

  return (
    <div className="pt-40 pb-24 px-6 bg-ivory min-h-screen" data-testid="checkout-success">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-xl glass-card p-12 text-center"
      >
        {state.kind === "loading" && (
          <>
            <Loader2 className="mx-auto text-gold animate-spin" size={36} />
            <h1 className="mt-6 font-display text-3xl text-emerald-vault">Confirming your order…</h1>
            <p className="mt-3 eyebrow text-onyx/50">Please remain on this page</p>
          </>
        )}
        {state.kind === "paid" && (
          <>
            <div className="mx-auto w-14 h-14 rounded-full bg-gold/15 grid place-items-center">
              <Check className="text-gold" size={26} />
            </div>
            <p className="mt-6 eyebrow">◆ Confirmé</p>
            <h1 className="mt-3 font-display text-4xl text-emerald-vault">Merci, the piece is <em className="gold-text not-italic">yours</em>.</h1>
            {state.amount && state.currency && (
              <p className="mt-4 text-onyx/60 font-light">
                Paid {formatPrice(state.amount, state.currency.toUpperCase())}
                {state.orderId && <> · order #{String(state.orderId).slice(-8)}</>}
              </p>
            )}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {state.orderId && (
                <Link href={`/account`} className="px-8 py-4 bg-emerald-vault text-ivory text-[11px] tracking-[0.4em] uppercase hover:bg-emerald transition" data-testid="success-orders-btn">
                  View Orders
                </Link>
              )}
              <Link href="/shop" className="px-8 py-4 border border-gold/40 text-onyx text-[11px] tracking-[0.4em] uppercase hover:bg-gold/10 hover:border-gold transition">
                Continue Browsing
              </Link>
            </div>
          </>
        )}
        {state.kind === "failed" && (
          <>
            <XCircle className="mx-auto text-red-500" size={36} />
            <h1 className="mt-6 font-display text-3xl text-emerald-vault">We couldn't confirm payment</h1>
            <p className="mt-3 text-onyx/60">{state.reason}</p>
            <Link href="/cart" className="inline-block mt-8 px-8 py-4 bg-emerald-vault text-ivory text-[11px] tracking-[0.4em] uppercase hover:bg-emerald transition">
              Return to Bag
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
