"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/store";
import { api, formatPrice, type Order } from "@/lib/api";

export default function AccountPage() {
  const router = useRouter();
  const { user, token, clear } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login");
      return;
    }
    api.myOrders(token).then((r) => setOrders(r.orders)).catch(() => {});
  }, [user, token, router]);

  if (!user) return null;

  return (
    <div className="pt-32 pb-24 px-6 lg:px-10 bg-ivory min-h-screen" data-testid="account-page">
      <div className="mx-auto max-w-[1000px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <p className="eyebrow">◆ Maison Privée</p>
          <h1 className="mt-6 font-display text-5xl text-emerald-vault">
            Welcome, <em className="gold-text not-italic">{user.name.split(" ")[0]}</em>
          </h1>
          <div className="hairline mt-6 mx-auto w-24" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6"><p className="eyebrow">Email</p><p className="mt-2 text-onyx break-all">{user.email}</p></div>
          <div className="glass-card p-6"><p className="eyebrow">Status</p><p className="mt-2 text-onyx">{user.role === "admin" ? "Maison Administrator" : "Client"}</p></div>
          <div className="glass-card p-6"><p className="eyebrow">Orders</p><p className="mt-2 text-onyx">{orders.length}</p></div>
        </div>

        {user.role === "admin" && (
          <Link href="/admin/dashboard" className="mb-8 block glass-card p-6 hover:border-gold transition" data-testid="admin-console-link">
            <p className="eyebrow">◆ Admin Console</p>
            <p className="mt-2 font-display text-xl text-emerald-vault">Manage the Maison →</p>
          </Link>
        )}

        <section>
          <h2 className="font-display text-2xl text-emerald-vault mb-6">Your Orders</h2>
          {orders.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <p className="eyebrow mb-6">No orders yet</p>
              <Link href="/shop" className="inline-block text-gold text-[11px] tracking-[0.4em] uppercase border-b border-gold/40 pb-1">Begin the Journey</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o._id} className="glass-card p-6 flex items-center justify-between" data-testid={`order-${o._id}`}>
                  <div>
                    <p className="eyebrow">Order</p>
                    <p className="mt-1 font-mono text-xs text-onyx">{o.orderNumber}</p>
                    <p className="mt-1 text-onyx/50 text-xs">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl text-gold">{formatPrice(o.total, o.currency)}</p>
                    <p className="eyebrow mt-1">{o.status} · {o.paymentStatus}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-16 text-center">
          <button onClick={() => { clear(); router.push("/"); }} className="text-[11px] tracking-[0.4em] uppercase text-onyx/60 hover:text-gold border-b border-onyx/20 pb-1 transition" data-testid="logout-btn">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
