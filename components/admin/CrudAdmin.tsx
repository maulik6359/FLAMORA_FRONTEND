"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";

export type CrudField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url" | "select" | "checkbox" | "date";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  colSpan?: 1 | 2;
};

export type CrudColumn = { key: string; label: string; render?: (row: any) => React.ReactNode; align?: "left" | "right" };

export function CrudAdmin({
  title,
  eyebrow,
  endpoint,
  fields,
  columns,
  extraActions,
}: {
  title: string;
  eyebrow: string;
  endpoint: string; // e.g. /admin/brands
  fields: CrudField[];
  columns: CrudColumn[];
  extraActions?: (row: any, refresh: () => void) => React.ReactNode;
}) {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!token) return;
    setBusy(true);
    try {
      // For coupons/inventory/products/etc use admin endpoint; for taxonomy use public list
      const url = endpoint.startsWith("/admin/") ? endpoint : `/admin${endpoint}`;
      const res = await fetch(`/api${url}?all=true`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setItems(data.items || []);
    } finally { setBusy(false); }
  }
  useEffect(() => { load(); }, [token]);

  async function save(payload: any) {
    if (!token) return;
    const isEdit = !!editing?._id;
    const url = isEdit ? `/api${endpoint.startsWith("/admin/") ? endpoint : `/admin${endpoint}`}/${editing._id}` : `/api${endpoint.startsWith("/admin/") ? endpoint : `/admin${endpoint}`}`;
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed");
    return data;
  }

  async function del(id: string) {
    if (!token) return;
    if (!confirm("Delete this item?")) return;
    const url = `/api${endpoint.startsWith("/admin/") ? endpoint : `/admin${endpoint}`}/${id}`;
    const res = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) return toast.error(data.message || "Delete failed");
    toast.success("Deleted");
    load();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: any = {};
    for (const f of fields) {
      const v = fd.get(f.name);
      if (f.type === "checkbox") payload[f.name] = v === "on";
      else if (f.type === "number") payload[f.name] = v ? Number(v) : undefined;
      else if (v !== null && v !== "") payload[f.name] = v;
    }
    try {
      await save(payload);
      toast.success(editing ? "Updated" : "Created");
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow text-neutral-500">◆ {eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl text-neutral-100">{title}</h1>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-gold text-neutral-950 text-[11px] tracking-[0.35em] uppercase font-medium hover:bg-gold-soft transition"
          data-testid={`${eyebrow.toLowerCase()}-create-btn`}
        >
          <Plus size={14} /> New
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-6" data-testid="crud-form-modal">
          <form onSubmit={onSubmit} className="w-full max-w-xl bg-[#111] border border-neutral-900 p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl text-neutral-100">{editing ? `Edit ${title}` : `New ${title.replace(/s$/, "")}`}</h2>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-neutral-500 hover:text-red-400"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((f) => {
                const val = editing?.[f.name] ?? "";
                const cls = "w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100";
                const span = f.colSpan === 2 || f.type === "textarea" ? "col-span-2" : "col-span-1";
                return (
                  <div key={f.name} className={span}>
                    <label className="eyebrow block mb-2 text-neutral-400">{f.label}{f.required && " *"}</label>
                    {f.type === "textarea" ? (
                      <textarea name={f.name} rows={3} defaultValue={val} required={f.required} className={cls} placeholder={f.placeholder} />
                    ) : f.type === "select" ? (
                      <select name={f.name} defaultValue={val} required={f.required} className={cls}>
                        <option value="">Select…</option>
                        {f.options?.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                      </select>
                    ) : f.type === "checkbox" ? (
                      <label className="flex items-center gap-2 text-sm text-neutral-300">
                        <input type="checkbox" name={f.name} defaultChecked={editing ? !!val : true} /> Enabled
                      </label>
                    ) : (
                      <input name={f.name} type={f.type || "text"} defaultValue={val} required={f.required} className={cls} placeholder={f.placeholder} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="px-6 py-2.5 bg-gold text-neutral-950 text-[11px] tracking-[0.35em] uppercase font-medium" data-testid="crud-form-submit">Save</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2.5 border border-neutral-800 text-neutral-400 text-[11px] tracking-[0.35em] uppercase">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#111] border border-neutral-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 border-b border-neutral-900">
              {columns.map((c) => (
                <th key={c.key} className={`py-4 px-4 ${c.align === "right" ? "text-right" : "text-left"}`}>{c.label}</th>
              ))}
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row._id} className="border-b border-neutral-900 hover:bg-neutral-900/40">
                {columns.map((c) => (
                  <td key={c.key} className={`py-3 px-4 text-neutral-300 ${c.align === "right" ? "text-right" : ""}`}>
                    {c.render ? c.render(row) : (row[c.key] ?? "—")}
                  </td>
                ))}
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex gap-2 items-center">
                    {extraActions?.(row, load)}
                    <button onClick={() => { setEditing(row); setShowForm(true); }} className="p-2 text-neutral-400 hover:text-gold" data-testid={`edit-${row._id}`}>
                      <Edit size={14} />
                    </button>
                    <button onClick={() => del(row._id)} className="p-2 text-neutral-400 hover:text-red-400" data-testid={`delete-${row._id}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!busy && items.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="text-center py-16 text-neutral-500 text-sm">No entries yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
