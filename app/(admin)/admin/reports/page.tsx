"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/store";
import { formatPrice } from "@/lib/api";

export default function ReportsPage() {
  const { token } = useAuth();
  const [from, setFrom] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState<any>({});

  async function load() {
    if (!token) return;
    const r = await fetch(`/api/admin/reports/sales?from=${from}&to=${to}`, { headers: { Authorization: `Bearer ${token}` } });
    setData(await r.json());
  }
  useEffect(() => { load(); }, [token, from, to]);

  return (
    <div className="space-y-6" data-testid="admin-reports-page">
      <div>
        <p className="eyebrow text-neutral-500">◆ Rapports</p>
        <h1 className="mt-2 font-display text-4xl text-neutral-100">Reports</h1>
      </div>

      <div className="flex gap-3">
        <div>
          <label className="eyebrow block mb-1 text-neutral-500">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-4 py-2 bg-[#111] border border-neutral-900 focus:border-gold outline-none text-sm text-neutral-100" data-testid="reports-from" />
        </div>
        <div>
          <label className="eyebrow block mb-1 text-neutral-500">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-4 py-2 bg-[#111] border border-neutral-900 focus:border-gold outline-none text-sm text-neutral-100" data-testid="reports-to" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111] border border-neutral-900 p-8"><p className="eyebrow text-neutral-500">Revenue</p><p className="mt-4 font-display text-4xl text-gold">{formatPrice(data.revenue || 0)}</p></div>
        <div className="bg-[#111] border border-neutral-900 p-8"><p className="eyebrow text-neutral-500">Paid Orders</p><p className="mt-4 font-display text-4xl text-neutral-100">{data.orders || 0}</p></div>
        <div className="bg-[#111] border border-neutral-900 p-8"><p className="eyebrow text-neutral-500">Average Order</p><p className="mt-4 font-display text-4xl text-neutral-100">{formatPrice(data.avg || 0)}</p></div>
      </div>

      <p className="eyebrow text-neutral-500">◆ More reports (orders by status, customers, inventory, tax, coupons, reviews) — endpoints ready, dedicated tabs coming in follow-up.</p>
    </div>
  );
}
