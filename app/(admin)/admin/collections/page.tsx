"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function CollectionsPage() {
  return (
    <CrudAdmin
      title="Collections"
      eyebrow="Chapitres"
      endpoint="/collections"
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "sortOrder", label: "Sort Order", type: "number" },
        { name: "image", label: "Cover Image URL", type: "url", colSpan: 2 },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
        { name: "isFeatured", label: "Featured", type: "checkbox" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={[
        { key: "image", label: "Cover", render: (r) => r.image ? <img src={r.image} alt="" className="h-10 w-16 object-cover" /> : "—" },
        { key: "name", label: "Name" },
        { key: "sortOrder", label: "Order", align: "right" },
        { key: "isFeatured", label: "Featured", render: (r) => r.isFeatured ? <span className="text-gold text-xs">★</span> : "—" },
        { key: "isActive", label: "Status", render: (r) => <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${r.isActive ? "bg-emerald-900/50 text-emerald-300" : "bg-neutral-900 text-neutral-500"}`}>{r.isActive ? "Active" : "Inactive"}</span> },
      ]}
    />
  );
}
