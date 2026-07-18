"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/store";

export default function InventoryHistoryPage() {
  const params = useParams();
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    const productId = String(params.productId);
    Promise.all([
      fetch(`/api/admin/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(`/api/admin/inventory/${productId}/history`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ]).then(([p, h]) => {
      setProduct(p.product);
      setItems(h.items || []);
    });
  }, [token, params.productId]);

  return (
    <div className="space-y-6" data-testid="inventory-history-page">
      <Link href="/admin/inventory" className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 hover:text-gold">← Back to inventory</Link>
      <div>
        <p className="eyebrow text-neutral-500">◆ Historique</p>
        <h1 className="mt-2 font-display text-4xl text-neutral-100">{product?.name ?? "—"}</h1>
        <p className="text-neutral-500 mt-1">Current stock: <span className="text-gold">{product?.stockQuantity ?? "—"}</span></p>
      </div>

      <div className="bg-[#111] border border-neutral-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 border-b border-neutral-900">
              <th className="text-left py-4 px-4">Date</th>
              <th className="text-left py-4">Type</th>
              <th className="text-right py-4">Qty</th>
              <th className="text-right py-4">Before</th>
              <th className="text-right py-4">After</th>
              <th className="text-left py-4">Reason</th>
              <th className="text-left py-4 pr-4">Admin</th>
            </tr>
          </thead>
          <tbody>
            {items.map((h) => (
              <tr key={h._id} className="border-b border-neutral-900" data-testid={`history-row-${h._id}`}>
                <td className="py-3 px-4 text-neutral-500 text-xs">{new Date(h.createdAt).toLocaleString()}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                    h.type === "add" ? "bg-emerald-900/50 text-emerald-300" :
                    h.type === "subtract" ? "bg-red-900/50 text-red-300" :
                    "bg-blue-900/50 text-blue-300"
                  }`}>{h.type}</span>
                </td>
                <td className="py-3 text-right text-neutral-100">{h.quantity}</td>
                <td className="py-3 text-right text-neutral-500">{h.stockBefore}</td>
                <td className="py-3 text-right text-gold">{h.stockAfter}</td>
                <td className="py-3 text-neutral-400 text-xs">{h.reason || "—"} {h.referenceId && <span className="text-neutral-600">· {h.referenceId}</span>}</td>
                <td className="py-3 pr-4 text-neutral-500 text-xs">{h.adminUser?.name || h.adminUser?.email || "—"}</td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={7} className="text-center py-16 text-neutral-500 text-sm">No adjustments recorded</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
