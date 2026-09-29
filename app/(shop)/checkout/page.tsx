"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import { toast } from "sonner";
import { UserCheck, LogOut, CreditCard, Banknote, ShieldCheck, Lock, AlertCircle, Loader2 } from "lucide-react";

import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { api, PaymentMethod } from "@/lib/api";
import { loadRazorpayScript } from "@/lib/razorpay";

const fields = [
  {
    id: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
  },
  {
    id: "name",
    label: "Full name",
    type: "text",
    autoComplete: "name",
  },
  {
    id: "address",
    label: "Address",
    type: "text",
    autoComplete: "street-address",
  },
  {
    id: "city",
    label: "City",
    type: "text",
    autoComplete: "address-level2",
  },
  {
    id: "postcode",
    label: "Postcode",
    type: "text",
    autoComplete: "postal-code",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const store = useCartStore();
  const { user, token, clear: clearAuth } = useAuth();
  const hydrated = useHydrated();

  const items = store.items ?? [];
  const clearCart = store.clearCart;

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    postcode: "",
    phone: "",
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string>("");
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [placed, setPlaced] = useState<{ orderNumber: string; paymentId?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Sync user details to form when loaded
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Gate access by authentication status
  useEffect(() => {
    if (hydrated && !user) {
      toast.info("Please sign in to access checkout");
      router.replace("/auth/login?from=/checkout");
    }
  }, [hydrated, user, router]);

  // Load available payment methods from backend
  useEffect(() => {
    async function fetchMethods() {
      try {
        setLoadingMethods(true);
        const res = await api.paymentMethods();
        let active = res.items || [];
        if (active.length === 0) {
          active = [
            {
              _id: "default-rzp",
              name: "Razorpay (UPI / Cards / NetBanking)",
              type: "card",
              provider: "razorpay",
              description: "Pay securely via UPI, Credit/Debit Cards, NetBanking or Mobile Wallets",
              isActive: true,
            },
            {
              _id: "default-cod",
              name: "Cash on Delivery",
              type: "cod",
              provider: "cod",
              description: "Pay with cash upon delivery of your luxury items",
              isActive: true,
            },
          ];
        }
        setPaymentMethods(active);
        const rzp = active.find((m) => m.provider === "razorpay");
        setSelectedMethodId(rzp ? rzp._id : active[0]._id);
      } catch (err) {
        console.error("Failed to load payment methods:", err);
        // Fallback default methods if API call encounters network issue
        const fallback: PaymentMethod[] = [
          {
            _id: "fallback-rzp",
            name: "Razorpay (UPI / Cards / NetBanking)",
            type: "card",
            provider: "razorpay",
            description: "Pay securely via UPI, Credit/Debit Cards, NetBanking or Mobile Wallets",
            isActive: true,
          },
          {
            _id: "fallback-cod",
            name: "Cash on Delivery",
            type: "cod",
            provider: "cod",
            description: "Pay with cash upon delivery of your luxury items",
            isActive: true,
          },
        ];
        setPaymentMethods(fallback);
        setSelectedMethodId(fallback[0]._id);
      } finally {
        setLoadingMethods(false);
      }
    }

    if (user) {
      fetchMethods();
    }
  }, [user]);

  const subtotal = store.subtotal();

  const handleFieldChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const selectedMethod = paymentMethods.find((m) => m._id === selectedMethodId);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      toast.error("Your bag is empty");
      return;
    }

    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!token) {
      toast.error("Session expired. Please log in again.");
      router.push("/auth/login?from=/checkout");
      return;
    }

    setBusy(true);

    try {
      // Step 1: Create Order in Backend
      setStatusMessage("Creating your order...");
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          postcode: formData.postcode,
          country: "Australia",
          phone: formData.phone,
        },
      };

      const orderRes = await api.createOrder(orderPayload, token);
      const createdOrder = orderRes.order;

      // Step 2: Handle according to selected payment method provider
      if (selectedMethod.provider === "razorpay") {
        setStatusMessage("Initializing Razorpay checkout...");
        
        // 2a. Fetch Razorpay Order credentials from backend
        let rzpOrder;
        try {
          rzpOrder = await api.createRazorpayOrder(createdOrder._id, token);
        } catch (rzpErr: any) {
          setBusy(false);
          setStatusMessage("");
          toast.error(rzpErr.message || "Could not initialize Razorpay payment. Please try again or select another method.");
          return;
        }

        // 2b. Load Razorpay script
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setBusy(false);
          setStatusMessage("");
          toast.error("Failed to load Razorpay SDK. Please check your internet connection and try again.");
          return;
        }

        // 2c. Prepare Razorpay modal options
        const rzpOptions = {
          key: rzpOrder.keyId,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: "FLĀMORÁ Jewellery",
          description: `Order #${rzpOrder.orderNumber}`,
          order_id: rzpOrder.razorpayOrderId,
          prefill: {
            name: formData.name || user.name,
            email: formData.email || user.email,
            contact: formData.phone || user.phone || "",
          },
          theme: {
            color: "#b89662",
          },
          handler: async (response: any) => {
            try {
              setStatusMessage("Verifying payment security signature...");
              const verifyRes = await api.verifyRazorpayPayment(
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: createdOrder._id,
                },
                token
              );

              if (verifyRes.success) {
                clearCart();
                setPlaced({
                  orderNumber: verifyRes.orderNumber || rzpOrder.orderNumber,
                  paymentId: response.razorpay_payment_id,
                });
                toast.success("Payment verified successfully!", {
                  description: `Order ${verifyRes.orderNumber} is confirmed.`,
                });
              } else {
                toast.error("Payment verification failed. Please contact support.");
              }
            } catch (vErr: any) {
              console.error("Verification error:", vErr);
              toast.error(vErr.message || "Payment verification failed.");
            } finally {
              setBusy(false);
              setStatusMessage("");
            }
          },
          modal: {
            ondismiss: async () => {
              setBusy(false);
              setStatusMessage("");
              toast.info("Payment cancelled. You can complete your purchase when ready.", {
                description: `Order reference: ${rzpOrder.orderNumber}`,
              });
              // Notify backend of user cancellation
              try {
                await api.reportPaymentFailure(
                  {
                    orderId: createdOrder._id,
                    razorpayOrderId: rzpOrder.razorpayOrderId,
                    error: "Payment modal closed by customer",
                  },
                  token
                );
              } catch (e) {
                // ignore reporting error
              }
            },
          },
        };

        const razorpayInstance = new (window as any).Razorpay(rzpOptions);
        
        razorpayInstance.on("payment.failed", async function (resp: any) {
          setBusy(false);
          setStatusMessage("");
          const failureReason = resp.error?.description || "Payment failed";
          toast.error(`Payment failed: ${failureReason}`);
          try {
            await api.reportPaymentFailure(
              {
                orderId: createdOrder._id,
                razorpayOrderId: rzpOrder.razorpayOrderId,
                error: resp.error,
              },
              token
            );
          } catch (e) {
            // ignore
          }
        });

        razorpayInstance.open();
      } else {
        // Cash on Delivery or non-Razorpay payment method
        clearCart();
        setPlaced({ orderNumber: createdOrder.orderNumber });
        setBusy(false);
        setStatusMessage("");
        toast.success("Order placed successfully!", {
          description: `Order ${createdOrder.orderNumber} has been received.`,
        });
      }
    } catch (err: any) {
      console.error("Checkout submit error:", err);
      setBusy(false);
      setStatusMessage("");
      toast.error(err.message || "Failed to process order. Please try again.");
    }
  };

  if (!hydrated || !user) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="size-4 animate-spin text-gold-deep" />
          Verifying session…
        </p>
      </main>
    );
  }

  if (placed) {
    return (
      <main className="min-h-[70vh]">
        <div className="mx-auto max-w-xl px-4 py-32 text-center">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-gold-deep/15 text-gold-deep mb-6">
            <ShieldCheck className="size-8" />
          </div>
          <p className="eyebrow text-gold-deep">Order confirmed</p>

          <h1 className="mt-4 font-display text-4xl md:text-5xl">Thank you</h1>

          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            Your order{" "}
            <span className="text-foreground font-semibold font-mono">
              {placed.orderNumber}
            </span>{" "}
            has been received and confirmed.
          </p>

          {placed.paymentId && (
            <p className="mt-2 text-xs text-muted-foreground font-mono">
              Razorpay Payment ID: {placed.paymentId}
            </p>
          )}

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Your FLĀMORÁ pieces will be prepared with care for complimentary insured dispatch.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/account"
              className="bg-ink px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-ivory hover:opacity-90"
            >
              View Orders
            </Link>
            <Link
              href="/shop"
              className="border border-ink px-8 py-4 text-[11px] uppercase tracking-[0.25em] hover:bg-ink hover:text-ivory transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-20">
        <div className="mb-12">
          <p className="eyebrow text-gold-deep">Secure checkout</p>

          <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4rem)]">
            Checkout
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            Complete your order with complimentary insured delivery and encrypted payment processing.
          </p>
        </div>

        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Authenticated User Status Card */}
            <div className="flex items-center justify-between rounded-md border border-border bg-silk/30 p-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="grid size-8 place-items-center rounded-full bg-gold-deep/15 text-gold-deep">
                  <UserCheck className="size-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Logged in as {user.name}
                  </p>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  clearAuth();
                  router.push("/auth/login?from=/checkout");
                }}
                className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                <LogOut className="size-3" />
                <span>Switch</span>
              </button>
            </div>

            <form className="space-y-9" onSubmit={handleSubmit}>
              {/* Step 1: Shipping Details */}
              <div className="space-y-6">
                <div>
                  <p className="eyebrow">Step 1</p>
                  <h2 className="mt-2 font-display text-2xl">Delivery details</h2>
                </div>

                {fields.map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="eyebrow">
                      {field.label}
                    </label>

                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      required
                      autoComplete={field.autoComplete}
                      value={formData[field.id as keyof typeof formData] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="mt-3 w-full border-b border-border bg-transparent py-3 text-sm focus:border-gold-deep focus:outline-none"
                    />
                  </div>
                ))}

                <div>
                  <label htmlFor="phone" className="eyebrow">
                    Phone Number (for delivery updates)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+61 400 000 000"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    className="mt-3 w-full border-b border-border bg-transparent py-3 text-sm focus:border-gold-deep focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="eyebrow">
                    Country
                  </label>

                  <input
                    id="country"
                    name="country"
                    value="Australia"
                    readOnly
                    className="mt-3 w-full border-b border-border bg-transparent py-3 text-sm text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Step 2: Payment Method Selection */}
              <div className="pt-6 border-t border-border space-y-6">
                <div>
                  <p className="eyebrow">Step 2</p>
                  <h2 className="mt-2 font-display text-2xl">Payment method</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Select your preferred payment method to proceed securely.
                  </p>
                </div>

                {loadingMethods ? (
                  <div className="p-8 border border-dashed border-border text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin text-gold-deep" />
                    Loading available payment gateways...
                  </div>
                ) : paymentMethods.length === 0 ? (
                  <div className="p-4 border border-amber-500/30 bg-amber-500/10 rounded text-xs text-amber-600 flex items-center gap-3">
                    <AlertCircle className="size-5 shrink-0" />
                    <div>
                      <p className="font-semibold">No payment methods currently active</p>
                      <p className="mt-0.5">Please contact customer support or try again later.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const isSelected = selectedMethodId === method._id;
                      const isRazorpay = method.provider === "razorpay";

                      return (
                        <div
                          key={method._id}
                          onClick={() => setSelectedMethodId(method._id)}
                          className={`group relative cursor-pointer border p-5 transition-all ${
                            isSelected
                              ? "border-gold-deep bg-gold-deep/5 shadow-sm"
                              : "border-border hover:border-gold-deep/50 bg-silk/10"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="pt-0.5">
                              <input
                                type="radio"
                                id={`pm-${method._id}`}
                                name="paymentMethod"
                                checked={isSelected}
                                onChange={() => setSelectedMethodId(method._id)}
                                className="accent-gold-deep size-4 cursor-pointer"
                              />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <label
                                  htmlFor={`pm-${method._id}`}
                                  className="font-medium text-sm text-foreground cursor-pointer flex items-center gap-2"
                                >
                                  {isRazorpay ? (
                                    <CreditCard className="size-4 text-gold-deep" />
                                  ) : (
                                    <Banknote className="size-4 text-gold-deep" />
                                  )}
                                  <span>{method.name}</span>
                                </label>

                                {isRazorpay && (
                                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 bg-gold-deep/15 text-gold-deep rounded font-semibold">
                                    Instant Verification
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                {method.description ||
                                  (isRazorpay
                                    ? "UPI, Cards, NetBanking, Wallets via secure Razorpay interface."
                                    : "Pay with cash upon delivery.")}
                              </p>

                              {isRazorpay && isSelected && (
                                <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground border-t border-gold-deep/20 pt-3">
                                  <div className="flex items-center gap-1 text-emerald-600 font-medium">
                                    <Lock className="size-3" />
                                    256-bit SSL Encrypted
                                  </div>
                                  <span>•</span>
                                  <span>UPI</span>
                                  <span>•</span>
                                  <span>Cards</span>
                                  <span>•</span>
                                  <span>NetBanking</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Status Message if processing */}
              {statusMessage && (
                <div className="p-4 border border-gold-deep/30 bg-gold-deep/10 text-xs text-gold-deep flex items-center gap-3 rounded">
                  <Loader2 className="size-4 animate-spin shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={items.length === 0 || busy || paymentMethods.length === 0}
                className="w-full bg-ink py-4 text-[11px] uppercase tracking-[0.28em] text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
              >
                {busy ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : selectedMethod?.provider === "razorpay" ? (
                  <>
                    <Lock className="size-3.5" />
                    <span>Pay {formatPrice(subtotal)} with Razorpay</span>
                  </>
                ) : (
                  <span>Place Order ({formatPrice(subtotal)})</span>
                )}
              </button>

              {items.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  Your bag is empty.
                </p>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <aside className="h-fit border border-border bg-silk/20 p-6 md:p-7 lg:sticky lg:top-28">
            <h2 className="eyebrow">Order summary</h2>

            {items.length === 0 ? (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">
                  No items in your bag.
                </p>

                <Link
                  href="/shop"
                  className="mt-5 inline-block text-xs uppercase tracking-[0.2em] underline underline-offset-4"
                >
                  Explore Jewellery
                </Link>
              </div>
            ) : (
              <>
                <ul className="mt-6 space-y-5">
                  {items.map((item, index) => {
                    const itemKey = `${item.id}-${item.metal || ""}-${item.size || ""}-${index}`;

                    return (
                      <li
                        key={itemKey}
                        className="flex gap-4 border-b border-border pb-5"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="aspect-[4/5] w-16 shrink-0 object-cover"
                          />
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-lg">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.metal || "Standard Metal"}
                            {item.size ? ` · ${item.size}` : ""}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Qty {item.quantity}
                          </p>
                        </div>

                        <span className="shrink-0 text-sm font-display">
                          {formatPrice(
                            Number(item.price || 0) * Number(item.quantity || 0),
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>

                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>

                    <span className="text-gold-deep font-medium">Complimentary</span>
                  </div>

                  <div className="flex justify-between border-t border-border pt-4 font-display text-xl">
                    <span>Total</span>

                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}