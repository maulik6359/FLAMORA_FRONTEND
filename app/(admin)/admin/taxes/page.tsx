"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function TaxesPage() {
  return (
    <CrudAdmin
      title="Taxes"
      eyebrow="Fiscal · Rates"
      endpoint="/taxes"
      fields={[
        { name: "name", label: "Name", required: true, placeholder: "GST 18%" },
        { name: "rate", label: "Rate (%)", type: "number", required: true, placeholder: "18" },
        { name: "applicableTo", label: "Applicable to", placeholder: "all, jewellery, accessories…" },
        { name: "country", label: "Country", placeholder: "IN" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={[
        { key: "name", label: "Tax" },
        { key: "rate", label: "Rate", align: "right", render: (r) => `${Number(r.rate).toFixed(2)}%` },
        { key: "applicableTo", label: "Scope" },
        { key: "country", label: "Country" },
        {
          key: "isActive",
          label: "Status",
          render: (r) => (
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${r.isActive ? "bg-emerald-900/50 text-emerald-300" : "bg-neutral-900 text-neutral-500"}`}>
              {r.isActive ? "Active" : "Inactive"}
            </span>
          ),
        },
      ]}
    />
  );
}
