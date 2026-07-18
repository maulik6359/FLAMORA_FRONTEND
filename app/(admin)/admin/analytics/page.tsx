"use client";
import { useEffect, useState } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useAuth } from "@/lib/store";
import { formatPrice } from "@/lib/api";

const GOLD = "#C9A961";
const EMERALD = "#04471C";
const CHART_COLORS = ["#C9A961", "#E5C158", "#04471C", "#8A7643", "#F0D89A", "#02291E"];

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [sales, setSales] = useState<any[]>([]);
  const [top, setTop] = useState<any[]>([]);
  const [byCategory, setByCategory] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch("/api/admin/analytics/sales", { headers: h }).then((r) => r.json()),
      fetch("/api/admin/analytics/products", { headers: h }).then((r) => r.json()),
      fetch("/api/admin/analytics/revenue-by-category", { headers: h }).then((r) => r.json()),
    ]).then(([s, p, c]) => {
      setSales(s.series || []);
      setTop(p.items || []);
      setByCategory(c.items || []);
    });
  }, [token]);

  const totalRevenue = sales.reduce((a, b) => a + b.revenue, 0);
  const totalOrders = sales.reduce((a, b) => a + b.orders, 0);
  const avg = totalOrders ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6" data-testid="admin-analytics-page">
      <div>
        <p className="eyebrow text-neutral-500">◆ Metrics</p>
        <h1 className="mt-2 font-display text-4xl text-neutral-100">Analytics · Last 30 days</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111] border border-neutral-900 p-5"><p className="eyebrow text-neutral-500">Revenue</p><p className="mt-3 font-display text-3xl text-gold">{formatPrice(totalRevenue)}</p></div>
        <div className="bg-[#111] border border-neutral-900 p-5"><p className="eyebrow text-neutral-500">Orders</p><p className="mt-3 font-display text-3xl text-neutral-100">{totalOrders}</p></div>
        <div className="bg-[#111] border border-neutral-900 p-5"><p className="eyebrow text-neutral-500">Avg Order Value</p><p className="mt-3 font-display text-3xl text-neutral-100">{formatPrice(avg)}</p></div>
      </div>

      <div className="bg-[#111] border border-neutral-900 p-6">
        <p className="eyebrow text-neutral-500 mb-4">Daily Revenue</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={sales} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GOLD} stopOpacity={0.6} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
            <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis stroke="#666" tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #262626", color: "#fafafa" }} labelStyle={{ color: GOLD }} formatter={(v: any) => formatPrice(v)} />
            <Area type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-neutral-900 p-6">
          <p className="eyebrow text-neutral-500 mb-4">Top Products</p>
          {top.length === 0 ? (
            <p className="text-center py-20 text-neutral-500 text-sm">No paid orders yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={top} layout="vertical" margin={{ left: 10, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis type="number" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" stroke="#666" tick={{ fontSize: 10 }} width={120} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #262626" }} formatter={(v: any) => formatPrice(v)} />
                <Bar dataKey="revenue" fill={GOLD} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-[#111] border border-neutral-900 p-6">
          <p className="eyebrow text-neutral-500 mb-4">Revenue by Category</p>
          {byCategory.length === 0 ? (
            <p className="text-center py-20 text-neutral-500 text-sm">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={byCategory} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={100} label={{ fill: "#fafafa", fontSize: 10 }}>
                  {byCategory.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #262626" }} formatter={(v: any) => formatPrice(v)} />
                <Legend wrapperStyle={{ fontSize: 10, color: "#a3a3a3" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
