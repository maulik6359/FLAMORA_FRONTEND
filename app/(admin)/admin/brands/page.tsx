"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function BrandsPage() {
  return (
    <CrudAdmin
      title="Brands"
      eyebrow="Maisons"
      endpoint="/brands"
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "website", label: "Website", type: "url" },
        { name: "logo", label: "Logo URL", type: "url" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={[
        { key: "logo", label: "Logo", render: (r) => r.logo ? <img src={r.logo} alt="" className="h-8 w-8 object-contain" /> : "—" },
        { key: "name", label: "Name" },
        { key: "website", label: "Website", render: (r) => r.website ? <a href={r.website} target="_blank" className="text-gold text-xs">{r.website.replace(/^https?:\/\//, "")}</a> : "—" },
        { key: "isActive", label: "Status", render: (r) => <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${r.isActive ? "bg-emerald-900/50 text-emerald-300" : "bg-neutral-900 text-neutral-500"}`}>{r.isActive ? "Active" : "Inactive"}</span> },
      ]}
    />
  );
}
