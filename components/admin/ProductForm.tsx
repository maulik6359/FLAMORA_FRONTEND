"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { api, type Category } from "@/lib/api";

export type ProductFormProps = {
  initial?: any;
  onSuccess: (product: any) => void;
  onCancel?: () => void;
};

export function ProductForm({ initial, onSuccess }: ProductFormProps) {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [busy, setBusy] = useState(false);
  const [images, setImages] = useState<string[]>(initial?.images || []);

  useEffect(() => {
    api.categories().then((r) => setCategories(r.categories));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    const fd = new FormData(e.currentTarget);
    const payload: any = {
      name: fd.get("name"),
      description: fd.get("description"),
      price: Number(fd.get("price")),
      discountPrice: fd.get("discountPrice") ? Number(fd.get("discountPrice")) : undefined,
      currency: fd.get("currency") || "EUR",
      category: fd.get("category"),
      material: fd.get("material") || undefined,
      gemstone: fd.get("gemstone") || undefined,
      carat: fd.get("carat") ? Number(fd.get("carat")) : undefined,
      stockQuantity: Number(fd.get("stockQuantity") || 0),
      images,
      isFeatured: fd.get("isFeatured") === "on",
      isNewArrival: fd.get("isNewArrival") === "on",
      isBestSeller: fd.get("isBestSeller") === "on",
      isTrending: fd.get("isTrending") === "on",
      isActive: fd.get("isActive") === "on",
    };
    try {
      setBusy(true);
      const result = initial?._id
        ? await api.admin.updateProduct(initial._id, payload, token)
        : await api.admin.createProduct(payload, token);
      toast.success(initial ? "Updated" : "Created");
      onSuccess(result.product);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" data-testid="product-form">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input name="name" required defaultValue={initial?.name} className={inputCls} data-testid="pf-name" />
        </Field>
        <Field label="Category" required>
          <select name="category" required defaultValue={initial?.category?._id || initial?.category || ""} className={inputCls} data-testid="pf-category">
            <option value="">Select…</option>
            {categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
          </select>
        </Field>
      </div>
      <Field label="Description" required>
        <textarea name="description" required rows={4} defaultValue={initial?.description} className={inputCls} data-testid="pf-description" />
      </Field>
      <div className="grid md:grid-cols-4 gap-4">
        <Field label="Price *"><input name="price" type="number" step="0.01" required defaultValue={initial?.price} className={inputCls} data-testid="pf-price" /></Field>
        <Field label="Discount Price"><input name="discountPrice" type="number" step="0.01" defaultValue={initial?.discountPrice || ""} className={inputCls} /></Field>
        <Field label="Currency"><input name="currency" defaultValue={initial?.currency || "EUR"} className={inputCls} /></Field>
        <Field label="Stock *"><input name="stockQuantity" type="number" required defaultValue={initial?.stockQuantity ?? 0} className={inputCls} data-testid="pf-stock" /></Field>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Field label="Material"><input name="material" defaultValue={initial?.material || ""} className={inputCls} /></Field>
        <Field label="Gemstone"><input name="gemstone" defaultValue={initial?.gemstone || ""} className={inputCls} /></Field>
        <Field label="Carat"><input name="carat" type="number" step="0.01" defaultValue={initial?.carat || ""} className={inputCls} /></Field>
      </div>

      <Field label="Image URLs (one per line)">
        <textarea
          rows={3}
          value={images.join("\n")}
          onChange={(e) => setImages(e.target.value.split(/\n+/).map((s) => s.trim()).filter(Boolean))}
          placeholder="https://images.unsplash.com/..."
          className={inputCls}
          data-testid="pf-images"
        />
        {images[0] && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={images[0]} alt="" className="mt-2 h-24 w-24 object-cover" />
        )}
      </Field>

      <div className="flex flex-wrap gap-6 text-sm text-neutral-300">
        {[
          { name: "isFeatured", label: "Featured" },
          { name: "isNewArrival", label: "New Arrival" },
          { name: "isBestSeller", label: "Best Seller" },
          { name: "isTrending", label: "Trending" },
          { name: "isActive", label: "Active" },
        ].map((f) => (
          <label key={f.name} className="flex items-center gap-2">
            <input type="checkbox" name={f.name} defaultChecked={f.name === "isActive" ? (initial?.isActive ?? true) : (initial?.[f.name] ?? false)} />
            {f.label}
          </label>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={busy} className="px-8 py-3 bg-gold text-neutral-950 text-[11px] tracking-[0.4em] uppercase font-medium hover:bg-gold-soft transition disabled:opacity-50" data-testid="pf-submit">
          {busy ? "Saving…" : initial ? "Save Changes" : "Create Piece"}
        </button>
      </div>
    </form>
  );
}

const inputCls = "w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-gold focus:outline-none text-sm text-neutral-100";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="eyebrow block mb-2 text-neutral-400">{label}{required && " *"}</label>
      {children}
    </div>
  );
}
