"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { api, type Category } from "@/lib/api";

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const r = await api.categories();
    setCategories(r.categories);
  }
  useEffect(() => { load(); }, []);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    const fd = new FormData(e.currentTarget);
    try {
      await api.admin.createCategory(
        { name: fd.get("name"), description: fd.get("description"), image: fd.get("image") },
        token,
      );
      toast.success("Category created");
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6" data-testid="admin-categories-page">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow text-neutral-500">◆ Ateliers</p>
          <h1 className="mt-2 font-display text-4xl text-neutral-100">Categories</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gold text-neutral-950 text-[11px] tracking-[0.35em] uppercase font-medium hover:bg-gold-soft transition"
          data-testid="admin-create-category-btn"
        >
          <Plus size={14} /> New Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={onCreate} className="bg-[#111] border border-neutral-900 p-6 space-y-4" data-testid="category-form">
          <input name="name" required placeholder="Name" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100" data-testid="cat-name" />
          <textarea name="description" rows={2} placeholder="Description" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100" />
          <input name="image" placeholder="Image URL" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100" />
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2.5 bg-gold text-neutral-950 text-[11px] tracking-[0.35em] uppercase font-medium" data-testid="cat-submit">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-neutral-800 text-neutral-400 text-[11px] tracking-[0.35em] uppercase">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div key={c._id} className="bg-[#111] border border-neutral-900 overflow-hidden" data-testid={`admin-category-${c.slug}`}>
            {c.image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={c.image} alt={c.name} className="h-32 w-full object-cover" />
            )}
            <div className="p-4">
              <p className="font-display text-lg text-neutral-100">{c.name}</p>
              <p className="mt-1 text-xs text-neutral-500">{c.slug}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
