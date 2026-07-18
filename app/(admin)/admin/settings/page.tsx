"use client";
import { useEffect, useMemo, useState } from "react";
import { Save, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";

type GroupDef = {
  key: string;
  label: string;
  description: string;
  fields: { name: string; label: string; type?: "text" | "textarea" | "url" | "email" | "number"; placeholder?: string; span?: 1 | 2 }[];
};

const GROUPS: GroupDef[] = [
  {
    key: "store",
    label: "Store",
    description: "Brand identity shown across the storefront",
    fields: [
      { name: "store_name", label: "Store name", placeholder: "FLAMORA" },
      { name: "store_tagline", label: "Tagline", placeholder: "Maison of quiet luxury" },
      { name: "store_email", label: "Contact email", type: "email", placeholder: "concierge@flamora.com" },
      { name: "store_phone", label: "Phone", placeholder: "+91…" },
      { name: "store_address", label: "Address", type: "textarea", span: 2 },
      { name: "store_currency", label: "Default currency", placeholder: "EUR" },
    ],
  },
  {
    key: "seo",
    label: "SEO",
    description: "Metadata for search engines & sharing",
    fields: [
      { name: "seo_title", label: "Default title", placeholder: "FLAMORA — Maison of Jewellery" },
      { name: "seo_description", label: "Meta description", type: "textarea", span: 2 },
      { name: "seo_keywords", label: "Keywords", placeholder: "luxury jewellery, fine gold…", span: 2 },
      { name: "seo_og_image", label: "OG image URL", type: "url", span: 2 },
    ],
  },
  {
    key: "social",
    label: "Social",
    description: "Links surfaced in the footer & share cards",
    fields: [
      { name: "social_instagram", label: "Instagram", type: "url" },
      { name: "social_facebook", label: "Facebook", type: "url" },
      { name: "social_twitter", label: "Twitter / X", type: "url" },
      { name: "social_youtube", label: "YouTube", type: "url" },
      { name: "social_pinterest", label: "Pinterest", type: "url" },
      { name: "social_linkedin", label: "LinkedIn", type: "url" },
    ],
  },
  {
    key: "checkout",
    label: "Checkout",
    description: "Commerce & tax defaults applied at checkout",
    fields: [
      { name: "checkout_min_order", label: "Minimum order (€)", type: "number" },
      { name: "checkout_free_shipping_above", label: "Free shipping above (€)", type: "number" },
      { name: "checkout_default_tax", label: "Default tax %", type: "number" },
      { name: "checkout_return_days", label: "Return window (days)", type: "number" },
    ],
  },
];

export default function SettingsPage() {
  const { token } = useAuth();
  const [grouped, setGrouped] = useState<Record<string, Record<string, any>>>({});
  const [active, setActive] = useState<string>("store");
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  const activeGroup = useMemo(() => GROUPS.find((g) => g.key === active)!, [active]);

  async function load() {
    if (!token) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/settings", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setGrouped(data.grouped || {});
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => { load(); }, [token]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, any> = {};
    for (const f of activeGroup.fields) {
      const v = fd.get(f.name);
      if (v === null) continue;
      if (f.type === "number") payload[f.name] = v === "" ? null : Number(v);
      else payload[f.name] = v;
    }
    try {
      const res = await fetch(`/api/admin/settings/${active}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");
      toast.success(`${activeGroup.label} settings saved`);
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const values = grouped[active] || {};

  return (
    <div className="space-y-6" data-testid="settings-page">
      <div>
        <p className="eyebrow text-neutral-500">◆ Console · Preferences</p>
        <h1 className="mt-2 font-display text-4xl text-neutral-100">Settings</h1>
        <p className="text-sm text-neutral-500 mt-2 max-w-2xl">
          Configure the maison — brand identity, SEO, socials, and commerce defaults. Changes are persisted to the audit log.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3 bg-[#111] border border-neutral-900 p-2 h-fit sticky top-0">
          {GROUPS.map((g) => {
            const isActive = g.key === active;
            return (
              <button
                key={g.key}
                onClick={() => setActive(g.key)}
                data-testid={`settings-tab-${g.key}`}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm transition ${
                  isActive ? "bg-gold/10 text-gold border-l-2 border-gold" : "text-neutral-300 hover:bg-neutral-900 hover:text-gold"
                }`}
              >
                <SettingsIcon size={14} />
                <span>{g.label}</span>
              </button>
            );
          })}
        </aside>

        <section className="col-span-12 lg:col-span-9">
          <form onSubmit={onSubmit} className="bg-[#111] border border-neutral-900 p-8 space-y-6" key={active}>
            <header className="pb-4 border-b border-neutral-900">
              <h2 className="font-display text-2xl text-neutral-100">{activeGroup.label}</h2>
              <p className="text-xs text-neutral-500 mt-1">{activeGroup.description}</p>
            </header>

            <div className="grid grid-cols-2 gap-4">
              {activeGroup.fields.map((f) => {
                const cls = "w-full px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-gold outline-none text-sm text-neutral-100";
                const span = f.span === 2 || f.type === "textarea" ? "col-span-2" : "col-span-1";
                const val = values[f.name] ?? "";
                return (
                  <div key={f.name} className={span}>
                    <label className="eyebrow block mb-2 text-neutral-400">{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea name={f.name} rows={3} defaultValue={val} placeholder={f.placeholder} className={cls} data-testid={`settings-field-${f.name}`} />
                    ) : (
                      <input
                        name={f.name}
                        type={f.type || "text"}
                        defaultValue={val}
                        placeholder={f.placeholder}
                        className={cls}
                        data-testid={`settings-field-${f.name}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-neutral-900">
              <button
                type="submit"
                disabled={saving || busy}
                className="flex items-center gap-2 px-6 py-2.5 bg-gold text-neutral-950 text-[11px] tracking-[0.35em] uppercase font-medium hover:bg-gold-soft transition disabled:opacity-50"
                data-testid="settings-save-btn"
              >
                <Save size={14} /> {saving ? "Saving…" : "Save changes"}
              </button>
              <span className="text-[11px] text-neutral-500 tracking-wider uppercase">Group · {activeGroup.key}</span>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
