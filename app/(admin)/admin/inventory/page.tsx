"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { History, Package } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { formatPrice } from "@/lib/api";

type InvItem = { _id: string; name: string; slug: string; sku?: string; stockQuantity: number; lowStockThreshold: number; price: number; currency: string; images: string[]; category: any };
type Summary = { totalPieces?: number; totalUnits?: number; totalValue?: number; lowStock?: number; outOfStock?: number };

export default function InventoryPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<InvItem[]>([]);
  const [summary, setSummary] = useState<Summary>({});
  const [lowOnly, setLowOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [adjust, setAdjust] = useState<InvItem | null>(null);

  async function load() {
    if (!token) return;
    const params = new URLSearchParams();
    if (lowOnly) params.set("lowStock", "true");
    if (search) params.set("search", search);
    params.set("limit", "50");
    const res = await fetch(`/api/admin/inventory?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setItems(data.items || []);
    setSummary(data.summary || {});
  }
  useEffect(() => { load(); }, [token, lowOnly]);

  async function submitAdjust(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!adjust || !token) return;
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/admin/inventory/${adjust._id}/adjust`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          type: fd.get("type"),
          quantity: Number(fd.get("quantity")),
          reason: fd.get("reason"),
          referenceId: fd.get("referenceId"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(`Stock: ${data.stockBefore} → ${data.stockAfter}`);
      setAdjust(null);
      load();
    } catch (err: any) { toast.error(err.message); }
  }

  const cards = [
    { label: "Pieces", value: summary.totalPieces ?? 0 },
    { label: "Total Units", value: summary.totalUnits ?? 0 },
    { label: "Stock Value", value: summary.totalValue ? formatPrice(summary.totalValue) : "—", accent: "text-gold" },
    { label: "Low Stock", value: summary.lowStock ?? 0, accent: "text-amber-400" },
    { label: "Out of Stock", value: summary.outOfStock ?? 0, accent: "text-red-400" },
  ];

  return (
    <div className="space-y-6" data-testid="admin-inventory-page">
      <div>
        <p className="eyebrow text-neutral-500">◆ Coffre</p>
        <h1 className="mt-2 font-display text-4xl text-neutral-100">Inventory</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-[#111] border border-neutral-900 p-5">
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500">{c.label}</p>
            <p className={`mt-3 font-display text-2xl ${c.accent || "text-neutral-100"}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} placeholder="Search by name…"
          className="flex-1 px-4 py-2.5 bg-[#111] border border-neutral-900 focus:border-gold outline-none text-sm text-neutral-100"
          data-testid="inventory-search" />
        <button onClick={() => setLowOnly(!lowOnly)} className={`px-6 py-2.5 text-[10px] tracking-[0.3em] uppercase border ${lowOnly ? "bg-amber-500 text-neutral-950 border-amber-500" : "border-neutral-800 text-neutral-400 hover:border-gold"}`} data-testid="filter-low-stock">
          {lowOnly ? "Low Stock ✓" : "Low Stock Only"}
        </button>
      </div>

      <div className="bg-[#111] border border-neutral-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 border-b border-neutral-900">
              <th className="text-left py-4 px-4">Piece</th>
              <th className="text-left py-4">Category</th>
              <th className="text-right py-4">Stock</th>
              <th className="text-right py-4">Threshold</th>
              <th className="text-right py-4">Unit Price</th>
              <th className="text-right py-4">Value</th>
              <th className="text-right py-4 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="border-b border-neutral-900 hover:bg-neutral-900/40" data-testid={`inv-row-${p._id}`}>
                <td className="py-3 px-4 flex items-center gap-3">
                  {p.images?.[0] && <img src={p.images[0]} alt="" className="h-10 w-10 object-cover" />}
                  <div>
                    <p className="text-neutral-100">{p.name}</p>
                    <p className="text-xs text-neutral-500">{p.slug}</p>
                  </div>
                </td>
                <td className="py-3 text-neutral-400">{p.category?.name ?? "—"}</td>
                <td className="py-3 text-right"><span className={p.stockQuantity <= p.lowStockThreshold ? "text-amber-400" : "text-neutral-100"}>{p.stockQuantity}</span></td>
                <td className="py-3 text-right text-neutral-500">{p.lowStockThreshold}</td>
                <td className="py-3 text-right text-gold">{formatPrice(p.price, p.currency)}</td>
                <td className="py-3 text-right text-neutral-100">{formatPrice(p.price * p.stockQuantity, p.currency)}</td>
                <td className="py-3 pr-4 text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => setAdjust(p)} className="p-2 text-neutral-400 hover:text-gold" title="Adjust" data-testid={`adjust-${p._id}`}>
                      <Package size={14} />
                    </button>
                    <Link href={`/admin/inventory/${p._id}/history`} className="p-2 text-neutral-400 hover:text-gold" title="History" data-testid={`history-${p._id}`}>
                      <History size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={7} className="text-center py-16 text-neutral-500 text-sm">No inventory</td></tr>}
          </tbody>
        </table>
      </div>

      {adjust && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-6" data-testid="adjust-modal">
          <form onSubmit={submitAdjust} className="w-full max-w-md bg-[#111] border border-neutral-900 p-8">
            <p className="eyebrow text-neutral-500">◆ Stock Adjustment</p>
            <h2 className="mt-2 font-display text-2xl text-neutral-100">{adjust.name}</h2>
            <p className="mt-1 text-sm text-neutral-500">Current: <span className="text-neutral-300">{adjust.stockQuantity}</span> units</p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="eyebrow block mb-2 text-neutral-400">Type</label>
                <select name="type" required className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100" data-testid="adjust-type">
                  <option value="add">Add (shipment received)</option>
                  <option value="subtract">Subtract (damage/return)</option>
                  <option value="set">Set to exact value</option>
                </select>
              </div>
              <div>
                <label className="eyebrow block mb-2 text-neutral-400">Quantity</label>
                <input name="quantity" type="number" required min={0} className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100" data-testid="adjust-quantity" />
              </div>
              <div>
                <label className="eyebrow block mb-2 text-neutral-400">Reason</label>
                <input name="reason" placeholder="e.g. Shipment PO-20260701" className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100" data-testid="adjust-reason" />
              </div>
              <div>
                <label className="eyebrow block mb-2 text-neutral-400">Reference ID</label>
                <input name="referenceId" placeholder="PO number, RMA, etc." className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100" />
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button type="submit" className="flex-1 px-6 py-3 bg-gold text-neutral-950 text-[11px] tracking-[0.35em] uppercase font-medium" data-testid="adjust-submit">Apply Adjustment</button>
              <button type="button" onClick={() => setAdjust(null)} className="px-6 py-3 border border-neutral-800 text-neutral-400 text-[11px] tracking-[0.35em] uppercase">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
