"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, XCircle, PackageCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth, useCart } from "@/lib/store";
import { api, formatPrice, type Order } from "@/lib/api";

function CheckoutSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order_id") || params.get("orderId");
  const paymentId = params.get("payment_id") || params.get("razorpay_payment_id");
  const { token } = useAuth();
  const cart = useCart();
  const [state, setState] = useState<{
    kind: "loading" | "paid" | "failed";
    order?: Order;
    reason?: string;
  }>({ kind: "loading" });
  const finalized = useRef(false);

  useEffect(() => {
    if (!token) return;

    // Clear cart on success landing
    if (!finalized.current) {
      finalized.current = true;
      cart.clear();
      try {
        sessionStorage.removeItem("flamora.pending_order");
      } catch {}
    }

    if (!orderId) {
      setState({ kind: "failed", reason: "Order identifier not found in request." });
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const { order } = await api.getOrder(orderId, token);
        if (cancelled) return;

        if (order.paymentStatus === "paid" || order.status === "confirmed") {
          setState({ kind: "paid", order });
          return;
        }

        if (order.paymentStatus === "failed" || order.status === "cancelled") {
          setState({ kind: "failed", reason: "Payment was declined or cancelled." });
          return;
        }

        attempts++;
        if (attempts >= 10) {
          // If still pending after retries, display current order state
          setState({ kind: "paid", order });
          return;
        }
        setTimeout(checkStatus, 1500);
      } catch (err: any) {
        if (!cancelled) {
          setState({ kind: "failed", reason: err.message || "Failed to retrieve order confirmation." });
        }
      }
    };

    checkStatus();

    return () => {
      cancelled = true;
    };
  }, [orderId, token, cart]);

  return (
    <div className="pt-36 pb-24 px-6 bg-ivory min-h-screen" data-testid="checkout-success">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-xl glass-card p-10 md:p-12 text-center"
      >
        {state.kind === "loading" && (
          <>
            <Loader2 className="mx-auto text-gold animate-spin" size={36} />
            <h1 className="mt-6 font-display text-3xl text-emerald-vault">Confirming your purchase…</h1>
            <p className="mt-3 eyebrow text-onyx/50">Securing your order with the Maison</p>
          </>
        )}

        {state.kind === "paid" && (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-gold/15 grid place-items-center mb-6">
              <Check className="text-gold" size={30} />
            </div>
            <p className="eyebrow">◆ Paiement Confirmé</p>
            <h1 className="mt-2 font-display text-4xl text-emerald-vault leading-tight">
              Merci, the piece is <em className="gold-text not-italic">yours</em>.
            </h1>

            {state.order && (
              <div className="mt-8 text-left glass-card p-6 border border-gold/30 bg-ivory/60 space-y-3 text-sm">
                <div className="flex justify-between items-center text-xs pb-3 border-b border-onyx/10">
                  <span className="text-onyx/60 uppercase tracking-widest font-mono">Order Number</span>
                  <span className="font-mono text-emerald-vault font-semibold">{state.order.orderNumber}</span>
                </div>
                {paymentId && (
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-onyx/10">
                    <span className="text-onyx/60 uppercase tracking-widest font-mono">Razorpay Payment ID</span>
                    <span className="font-mono text-onyx text-[11px] truncate max-w-[200px]">{paymentId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs pb-3 border-b border-onyx/10">
                  <span className="text-onyx/60 uppercase tracking-widest font-mono">Status</span>
                  <span className="px-2 py-0.5 text-[10px] tracking-wider uppercase bg-emerald-100 text-emerald-800 font-semibold rounded">
                    {state.order.paymentStatus === "paid" ? "Paid & Confirmed" : "Processing"}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-onyx font-medium">Total Paid</span>
                  <span className="font-display text-2xl text-gold font-bold">
                    {formatPrice(state.order.total, state.order.currency)}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/account"
                className="px-8 py-4 bg-emerald-vault text-ivory text-[11px] tracking-[0.4em] uppercase hover:bg-emerald transition flex items-center justify-center gap-2"
                data-testid="success-orders-btn"
              >
                <PackageCheck size={14} />
                <span>View Orders</span>
              </Link>
              <Link
                href="/shop"
                className="px-8 py-4 border border-gold/40 text-onyx text-[11px] tracking-[0.4em] uppercase hover:bg-gold/10 hover:border-gold transition flex items-center justify-center gap-2"
              >
                <span>Continue Browsing</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </>
        )}

        {state.kind === "failed" && (
          <>
            <XCircle className="mx-auto text-red-500" size={40} />
            <h1 className="mt-6 font-display text-3xl text-emerald-vault">We couldn't confirm payment</h1>
            <p className="mt-3 text-onyx/70 text-sm">{state.reason}</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href="/cart"
                className="px-8 py-4 bg-emerald-vault text-ivory text-[11px] tracking-[0.4em] uppercase hover:bg-emerald transition"
              >
                Return to Bag
              </Link>
              <Link
                href="/shop"
                className="px-8 py-4 border border-gold/40 text-onyx text-[11px] tracking-[0.4em] uppercase hover:bg-gold/10 transition"
              >
                Explore Collection
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory pt-36 text-center">Confirming your purchase…</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
