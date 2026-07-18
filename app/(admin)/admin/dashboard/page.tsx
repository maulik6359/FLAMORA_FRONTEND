"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Euro, ShoppingBag, Users, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/store";
import { api, formatPrice } from "@/lib/api";
import { toast } from "sonner";

type Stats = { totalRevenue: number; totalOrders: number; totalCustomers: number; totalProducts: number; pendingOrders: number; lowStockProducts: number; revenueToday: number; newCustomersToday: number };

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    Promise.all([api.admin.dashboard(token), api.admin.recentOrders(token)])
      .then(([s, r]) => { setStats(s); setRecent(r.orders); })
      .catch((e) => toast.error(e.message));
  }, [token]);

  const cards = [
    { label: "Total Revenue", value: stats ? formatPrice(stats.totalRevenue) : "—", icon: Euro, accent: "text-gold" },
    { label: "Orders", value: stats?.totalOrders ?? "—", icon: ShoppingBag, accent: "text-emerald-300" },
    { label: "Customers", value: stats?.totalCustomers ?? "—", icon: Users, accent: "text-blue-300" },
    { label: "Products", value: stats?.totalProducts ?? "—", icon: Package, accent: "text-purple-300" },
    { label: "Pending Orders", value: stats?.pendingOrders ?? "—", icon: TrendingUp, accent: "text-amber-300" },
    { label: "Low Stock", value: stats?.lowStockProducts ?? "—", icon: AlertTriangle, accent: "text-red-400" },
  ];

  return (
    <div className="space-y-8" data-testid="admin-dashboard">
      <div>
        <p className="eyebrow text-neutral-500">◆ Console · Overview</p>
        <h1 className="mt-2 font-display text-4xl text-neutral-100">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#111] border border-neutral-900 p-5"
              data-testid={`stat-${c.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500">{c.label}</p>
                <Icon size={14} className={c.accent} />
              </div>
              <p className="mt-3 font-display text-3xl text-neutral-100">{c.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-[#111] border border-neutral-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-neutral-100">Recent Orders</h2>
          <span className="eyebrow text-neutral-500">Latest 10</span>
        </div>
        {recent.length === 0 ? (
          <p className="text-center py-12 text-neutral-500 text-sm">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="recent-orders-table">
              <thead>
                <tr className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 border-b border-neutral-900">
                  <th className="text-left py-3">Order</th>
                  <th className="text-left py-3">Customer</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Payment</th>
                  <th className="text-right py-3">Total</th>
                  <th className="text-right py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o._id} className="border-b border-neutral-900 hover:bg-neutral-900/50">
                    <td className="py-3 font-mono text-xs text-gold">{o.orderNumber}</td>
                    <td className="py-3 text-neutral-300">{o.user?.name ?? "—"}</td>
                    <td className="py-3"><span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-neutral-900 text-neutral-300">{o.status}</span></td>
                    <td className="py-3"><span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider ${o.paymentStatus === "paid" ? "bg-emerald-900/50 text-emerald-300" : "bg-amber-900/40 text-amber-300"}`}>{o.paymentStatus}</span></td>
                    <td className="py-3 text-right text-neutral-100">{formatPrice(o.total, o.currency)}</td>
                    <td className="py-3 text-right text-neutral-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
