"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function GemstonesPage() {
  return (
    <CrudAdmin
      title="Gemstones"
      eyebrow="Pierres"
      endpoint="/gemstones"
      fields={[
        { name: "name", label: "Name", required: true, placeholder: "Diamond" },
        { name: "type", label: "Type", type: "select", options: [
          { value: "precious", label: "Precious" },
          { value: "semi_precious", label: "Semi-precious" },
          { value: "synthetic", label: "Synthetic" },
        ], required: true },
        { name: "hardnessMohs", label: "Hardness (Mohs)", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "type", label: "Type", render: (r) => <span className="text-neutral-400 capitalize">{r.type?.replace("_", "-")}</span> },
        { key: "hardnessMohs", label: "Mohs", align: "right", render: (r) => r.hardnessMohs ? `${r.hardnessMohs}/10` : "—" },
        { key: "isActive", label: "Status", render: (r) => <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${r.isActive ? "bg-emerald-900/50 text-emerald-300" : "bg-neutral-900 text-neutral-500"}`}>{r.isActive ? "Active" : "Inactive"}</span> },
      ]}
    />
  );
}
