"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { formatPrice } from "@/lib/api";

export default function ProductVariantsPage() {
  const params = useParams();
  const { token } = useAuth();
  const [variants, setVariants] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    if (!token) return;
    const productId = String(params.id);
    const [p, v] = await Promise.all([
      fetch(`/api/admin/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(`/api/admin/products/${productId}/variants`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ]);
    setProduct(p.product);
    setVariants(v.items || []);
  }
  useEffect(() => { load(); }, [token, params.id]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    const fd = new FormData(e.currentTarget);
    const attributes: any = {};
    for (const k of ["size", "purity", "color"]) {
      const v = fd.get(k);
      if (v) attributes[k] = v;
    }
    try {
      const res = await fetch(`/api/admin/products/${params.id}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          sku: fd.get("sku"),
          price: Number(fd.get("price")),
          stockQuantity: Number(fd.get("stockQuantity") || 0),
          attributes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Variant added");
      setShowForm(false);
      load();
    } catch (err: any) { toast.error(err.message); }
  }

  async function del(id: string) {
    if (!token) return;
    if (!confirm("Delete this variant?")) return;
    await fetch(`/api/admin/products/${params.id}/variants/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    toast.success("Deleted");
    load();
  }

  return (
    <div className="space-y-6" data-testid="variants-page">
      <Link href={`/admin/products/${params.id}/edit`} className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 hover:text-gold">← Back to product</Link>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow text-neutral-500">◆ Variantes</p>
          <h1 className="mt-2 font-display text-4xl text-neutral-100">{product?.name}</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3 bg-gold text-neutral-950 text-[11px] tracking-[0.35em] uppercase font-medium hover:bg-gold-soft" data-testid="variant-create-btn">
          <Plus size={14} /> New Variant
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-6">
          <form onSubmit={onSubmit} className="w-full max-w-lg bg-[#111] border border-neutral-900 p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-neutral-100">New Variant</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-neutral-500 hover:text-red-400"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="SKU *"><input name="sku" required placeholder="JW-GOLD-18K-SIZE7" /></Field>
              <Field label="Price *"><input name="price" type="number" step="0.01" required /></Field>
              <Field label="Stock"><input name="stockQuantity" type="number" defaultValue={0} /></Field>
              <Field label="Size"><input name="size" placeholder="7" /></Field>
              <Field label="Purity"><input name="purity" placeholder="18k" /></Field>
              <Field label="Color"><input name="color" placeholder="Yellow Gold" /></Field>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="px-6 py-2.5 bg-gold text-neutral-950 text-[11px] tracking-[0.35em] uppercase font-medium" data-testid="variant-submit">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-neutral-800 text-neutral-400 text-[11px] tracking-[0.35em] uppercase">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#111] border border-neutral-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 border-b border-neutral-900">
              <th className="text-left py-4 px-4">SKU</th>
              <th className="text-left py-4">Attributes</th>
              <th className="text-right py-4">Price</th>
              <th className="text-right py-4">Stock</th>
              <th className="text-right py-4 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v._id} className="border-b border-neutral-900" data-testid={`variant-${v._id}`}>
                <td className="py-3 px-4 font-mono text-xs text-gold">{v.sku}</td>
                <td className="py-3 text-neutral-400 text-xs">
                  {Object.entries(v.attributes || {}).map(([k, val]: any) => (<span key={k} className="mr-3">{k}: <span className="text-neutral-100">{val}</span></span>))}
                </td>
                <td className="py-3 text-right text-gold">{formatPrice(v.price)}</td>
                <td className="py-3 text-right text-neutral-100">{v.stockQuantity}</td>
                <td className="py-3 pr-4 text-right">
                  <button onClick={() => del(v._id)} className="p-2 text-neutral-400 hover:text-red-400"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {variants.length === 0 && <tr><td colSpan={5} className="text-center py-16 text-neutral-500 text-sm">No variants — click "New Variant" to add sizes/purities.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="eyebrow block mb-2 text-neutral-400">{label}</label>
      <div className="[&_input]:w-full [&_input]:px-3 [&_input]:py-2 [&_input]:bg-neutral-950 [&_input]:border [&_input]:border-neutral-800 [&_input]:focus:border-gold [&_input]:outline-none [&_input]:text-sm [&_input]:text-neutral-100">
        {children}
      </div>
    </div>
  );
}
