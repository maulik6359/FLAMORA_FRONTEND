"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { api, formatPrice } from "@/lib/api";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("");

  async function load() {
    if (!token) return;
    const params: any = { limit: 50 };
    if (statusFilter) params.status = statusFilter;
    const r = await api.admin.orders(params, token);
    setItems(r.items);
  }

  useEffect(() => { load(); }, [token, statusFilter]);

  async function changeStatus(id: string, status: string) {
    if (!token) return;
    await api.admin.updateOrderStatus(id, { status }, token);
    toast.success(`Order marked ${status}`);
    load();
  }

  return (
    <div className="space-y-6" data-testid="admin-orders-page">
      <div>
        <p className="eyebrow text-neutral-500">◆ Commerce</p>
        <h1 className="mt-2 font-display text-4xl text-neutral-100">Orders</h1>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter("")}
          className={`px-4 py-2 text-[10px] tracking-[0.3em] uppercase border ${!statusFilter ? "bg-gold text-neutral-950 border-gold" : "border-neutral-800 text-neutral-400 hover:border-gold"}`}
        >All</button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 text-[10px] tracking-[0.3em] uppercase border ${statusFilter === s ? "bg-gold text-neutral-950 border-gold" : "border-neutral-800 text-neutral-400 hover:border-gold"}`}
            data-testid={`filter-${s}`}
          >{s}</button>
        ))}
      </div>

      <div className="bg-[#111] border border-neutral-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 border-b border-neutral-900">
              <th className="text-left py-4 px-6">Order</th>
              <th className="text-left py-4">Customer</th>
              <th className="text-left py-4">Payment</th>
              <th className="text-right py-4">Total</th>
              <th className="text-left py-4">Status</th>
              <th className="text-right py-4 pr-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((o) => (
              <tr key={o._id} className="border-b border-neutral-900 hover:bg-neutral-900/40" data-testid={`admin-order-${o._id}`}>
                <td className="py-3 px-6">
                  <p className="font-mono text-xs text-gold">{o.orderNumber}</p>
                  <p className="text-neutral-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="py-3 text-neutral-300">{o.user?.name ?? "—"}</td>
                <td className="py-3"><span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider ${o.paymentStatus === "paid" ? "bg-emerald-900/50 text-emerald-300" : "bg-amber-900/40 text-amber-300"}`}>{o.paymentStatus}</span></td>
                <td className="py-3 text-right text-neutral-100">{formatPrice(o.total, o.currency)}</td>
                <td className="py-3"><span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-neutral-900 text-neutral-300">{o.status}</span></td>
                <td className="py-3 pr-6 text-right">
                  <select
                    value={o.status}
                    onChange={(e) => changeStatus(o._id, e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs px-2 py-1 focus:border-gold outline-none"
                    data-testid={`admin-order-status-${o._id}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="text-center py-16 text-neutral-500 text-sm">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
