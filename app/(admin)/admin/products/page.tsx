"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { api, formatPrice, type Product } from "@/lib/api";

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!token) return;
    setBusy(true);
    try {
      const r = await api.admin.products({ search, limit: 50 }, token);
      setItems(r.items);
    } finally { setBusy(false); }
  }

  useEffect(() => { load(); }, [token]);

  async function del(id: string, name: string) {
    if (!token) return;
    if (!confirm(`Delete "${name}"?`)) return;
    await api.admin.deleteProduct(id, token);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="space-y-6" data-testid="admin-products-page">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow text-neutral-500">◆ Catalogue</p>
          <h1 className="mt-2 font-display text-4xl text-neutral-100">Products</h1>
        </div>
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 px-6 py-3 bg-gold text-neutral-950 text-[11px] tracking-[0.35em] uppercase font-medium hover:bg-gold-soft transition"
          data-testid="admin-create-product-btn"
        >
          <Plus size={14} /> New Piece
        </Link>
      </div>

      <div className="flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Search by name…"
          className="flex-1 px-4 py-2.5 bg-[#111] border border-neutral-900 focus:border-gold focus:outline-none text-sm text-neutral-100"
          data-testid="admin-products-search"
        />
        <button onClick={load} className="px-6 py-2.5 border border-neutral-900 text-neutral-300 hover:text-gold text-[11px] tracking-[0.3em] uppercase">
          Search
        </button>
      </div>

      <div className="bg-[#111] border border-neutral-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 border-b border-neutral-900">
              <th className="text-left py-4 px-6">Image</th>
              <th className="text-left py-4">Name</th>
              <th className="text-left py-4">Category</th>
              <th className="text-right py-4">Price</th>
              <th className="text-right py-4">Stock</th>
              <th className="text-right py-4 pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="border-b border-neutral-900 hover:bg-neutral-900/40" data-testid={`admin-product-${p._id}`}>
                <td className="py-3 px-6">
                  {p.images[0] && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.images[0]} alt="" className="h-14 w-14 object-cover" />
                  )}
                </td>
                <td className="py-3">
                  <p className="text-neutral-100">{p.name}</p>
                  <p className="text-xs text-neutral-500">{p.slug}</p>
                </td>
                <td className="py-3 text-neutral-400">{typeof p.category === "object" ? p.category.name : "—"}</td>
                <td className="py-3 text-right text-gold">{formatPrice(p.discountPrice || p.price, p.currency)}</td>
                <td className="py-3 text-right">
                  <span className={p.stockQuantity <= 3 ? "text-amber-400" : "text-neutral-300"}>{p.stockQuantity}</span>
                </td>
                <td className="py-3 pr-6 text-right">
                  <div className="inline-flex gap-2">
                    <Link href={`/admin/products/${p._id}/edit`} className="p-2 text-neutral-400 hover:text-gold" data-testid={`admin-edit-${p._id}`}>
                      <Edit size={14} />
                    </Link>
                    <button onClick={() => del(p._id, p.name)} className="p-2 text-neutral-400 hover:text-red-400" data-testid={`admin-delete-${p._id}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!busy && items.length === 0 && (
              <tr><td colSpan={6} className="text-center py-16 text-neutral-500 text-sm">No products yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
