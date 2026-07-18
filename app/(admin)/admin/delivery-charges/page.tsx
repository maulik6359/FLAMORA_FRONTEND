"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function DeliveryChargesPage() {
  return (
    <CrudAdmin
      title="Delivery Charges"
      eyebrow="Fulfilment · Fees"
      endpoint="/delivery-charges"
      fields={[
        { name: "name", label: "Name", required: true, placeholder: "Standard" },
        { name: "baseCharge", label: "Base charge (€)", type: "number", required: true },
        { name: "freeAboveOrderValue", label: "Free above order value (€)", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={[
        { key: "name", label: "Rule" },
        { key: "baseCharge", label: "Base", align: "right", render: (r) => `€ ${Number(r.baseCharge || 0).toFixed(2)}` },
        { key: "freeAboveOrderValue", label: "Free ≥", align: "right", render: (r) => r.freeAboveOrderValue ? `€ ${r.freeAboveOrderValue}` : "—" },
        {
          key: "isActive",
          label: "Status",
          render: (r) => (
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${r.isActive ? "bg-emerald-900/50 text-emerald-300" : "bg-neutral-900 text-neutral-500"}`}>
              {r.isActive ? "Live" : "Off"}
            </span>
          ),
        },
      ]}
    />
  );
}
