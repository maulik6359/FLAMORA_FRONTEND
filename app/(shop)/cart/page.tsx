"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, X, Loader2, ShieldCheck, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useAuth, useCart } from "@/lib/store";
import { api, formatPrice } from "@/lib/api";
import { loadRazorpayScript, type RazorpayOptions } from "@/lib/razorpay";

export default function CartPage() {
  const router = useRouter();
  const cart = useCart();
  const { user, token } = useAuth();
  const [busy, setBusy] = useState(false);
  const items = cart.items;
  const subtotal = cart.subtotal();

  async function handleCheckout() {
    if (!user || !token) {
      toast.info("Please sign in to complete your order");
      router.push("/login?from=/cart");
      return;
    }
    if (items.length === 0) return;

    try {
      setBusy(true);

      // 1. Ensure Razorpay checkout script is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setBusy(false);
        toast.error("Razorpay SDK could not be loaded. Please check your internet connection.");
        return;
      }

      // 2. Create the Order in backend
      const { order } = await api.createOrder(
        { items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })) },
        token,
      );

      // 3. Initialize Razorpay order on backend
      const rzpOrderData = await api.createRazorpayOrder(order._id, token);

      // 4. Configure Razorpay modal options
      const options: RazorpayOptions = {
        key: rzpOrderData.keyId,
        amount: rzpOrderData.amount,
        currency: rzpOrderData.currency,
        name: "FLAMORA",
        description: `Order ${rzpOrderData.orderNumber}`,
        order_id: rzpOrderData.razorpayOrderId,
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#0f2e24", // Flamora Emerald Vault
        },
        handler: async function (response) {
          try {
            toast.loading("Verifying your payment…", { id: "rzp-verify" });
            const verifyRes = await api.verifyRazorpayPayment(
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              },
              token,
            );

            toast.dismiss("rzp-verify");
            if (verifyRes.success) {
              cart.clear();
              toast.success("Payment verified! Thank you for your order.");
              router.push(`/checkout/success?order_id=${verifyRes.orderId}&payment_id=${verifyRes.paymentId}`);
            } else {
              setBusy(false);
              toast.error("Payment verification could not be confirmed.");
            }
          } catch (verifyErr: any) {
            toast.dismiss("rzp-verify");
            setBusy(false);
            toast.error(verifyErr.message || "Payment verification failed.");
          }
        },
        modal: {
          ondismiss: function () {
            setBusy(false);
            toast.info("Payment window closed. Your bag is saved.");
            api
              .reportPaymentFailure(
                {
                  orderId: order._id,
                  razorpayOrderId: rzpOrderData.razorpayOrderId,
                  error: "Customer closed payment modal",
                },
                token,
              )
              .catch(() => {});
          },
        },
      };

      // 5. Open Razorpay modal
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setBusy(false);
        const errMsg = response.error?.description || "Payment failed. Please try again.";
        toast.error(errMsg);
        api
          .reportPaymentFailure(
            {
              orderId: order._id,
              razorpayOrderId: rzpOrderData.razorpayOrderId,
              error: response.error,
            },
            token,
          )
          .catch(() => {});
      });
      rzp.open();
    } catch (e: any) {
      setBusy(false);
      toast.error(e.message || "Could not start Razorpay checkout");
    }
  }

  return (
    <div className="pt-32 pb-24 px-6 lg:px-10 bg-ivory min-h-screen" data-testid="cart-page">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center mb-16">
          <p className="eyebrow">◆ Votre Sélection</p>
          <h1 className="mt-6 font-display text-5xl md:text-6xl text-emerald-vault">
            Your <em className="gold-text not-italic">Bag</em>
          </h1>
          <div className="hairline mt-6 mx-auto w-24" />
        </div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <p className="text-onyx/50 tracking-[0.3em] uppercase text-sm mb-8">The bag is empty</p>
            <Link
              href="/shop"
              className="inline-block px-10 py-4 bg-emerald-vault text-ivory text-[11px] tracking-[0.4em] uppercase hover:bg-emerald transition"
              data-testid="cart-empty-cta"
            >
              Discover the Maison
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4" data-testid="cart-items-list">
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-6 p-6 glass-card"
                  data-testid={`cart-item-${item.productId}`}
                >
                  {item.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.image} alt={item.name} className="h-28 w-28 object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.slug}`} className="font-display text-xl text-emerald-vault hover:text-gold transition">
                      {item.name}
                    </Link>
                    <p className="mt-2 text-onyx/60 text-sm">{formatPrice(item.price)}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center border border-gold/40">
                        <button onClick={() => cart.setQty(item.productId, item.quantity - 1)} className="px-3 py-1.5 hover:bg-gold/10">
                          <Minus size={12} />
                        </button>
                        <span className="px-4 text-sm">{item.quantity}</span>
                        <button onClick={() => cart.setQty(item.productId, item.quantity + 1)} className="px-3 py-1.5 hover:bg-gold/10">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => cart.remove(item.productId)}
                        className="text-onyx/40 hover:text-red-600 transition"
                        data-testid={`cart-remove-${item.productId}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl text-gold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32 glass-card p-8">
                <p className="eyebrow">◆ Résumé</p>
                <h3 className="mt-3 font-display text-2xl text-emerald-vault">Order Summary</h3>
                <div className="hairline mt-4" />
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-onyx/60">Subtotal</span>
                    <span className="text-onyx">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-onyx/60">Shipping</span>
                    <span className="text-gold">Complimentary</span>
                  </div>
                  <div className="hairline my-4" />
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-xl">Total</span>
                    <span className="font-display text-3xl text-gold">{formatPrice(subtotal)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={busy}
                  className="mt-8 w-full px-8 py-4 bg-emerald-vault text-ivory text-[11px] tracking-[0.4em] uppercase hover:bg-emerald transition disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="checkout-btn"
                >
                  {busy ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} className="text-gold" />}
                  {busy ? "Opening Gateway…" : user ? "Pay with Razorpay" : "Sign In to Checkout"}
                </button>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-onyx/50">
                  <ShieldCheck size={13} className="text-gold" />
                  <span>Secured by Razorpay · Certified authentic</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
