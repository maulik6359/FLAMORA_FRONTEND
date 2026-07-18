"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function MaterialsPage() {
  return (
    <CrudAdmin
      title="Materials"
      eyebrow="Métaux"
      endpoint="/materials"
      fields={[
        { name: "name", label: "Name", required: true, placeholder: "18k Yellow Gold" },
        { name: "isActive", label: "Active", type: "checkbox" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "description", label: "Description", render: (r) => r.description ? <span className="text-neutral-500 text-xs">{r.description.slice(0, 60)}…</span> : "—" },
        { key: "isActive", label: "Status", render: (r) => <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${r.isActive ? "bg-emerald-900/50 text-emerald-300" : "bg-neutral-900 text-neutral-500"}`}>{r.isActive ? "Active" : "Inactive"}</span> },
      ]}
    />
  );
}
