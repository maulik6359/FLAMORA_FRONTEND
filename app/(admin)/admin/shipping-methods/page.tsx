"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function ShippingMethodsPage() {
  return (
    <CrudAdmin
      title="Shipping Methods"
      eyebrow="Logistics · Couriers"
      endpoint="/shipping-methods"
      fields={[
        { name: "name", label: "Name", required: true, placeholder: "Standard Delivery" },
        { name: "carrier", label: "Carrier", placeholder: "DHL, FedEx, BlueDart…" },
        { name: "estimatedDays", label: "Estimated Days", placeholder: "3–5 business days" },
        { name: "price", label: "Price", type: "number", required: true },
        { name: "freeAbove", label: "Free above (order total)", type: "number" },
        { name: "countries", label: "Countries (comma-separated)", placeholder: "IN, US, GB…" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={[
        { key: "name", label: "Method" },
        { key: "carrier", label: "Carrier" },
        { key: "estimatedDays", label: "ETA" },
        { key: "price", label: "Price", align: "right", render: (r) => `€ ${Number(r.price || 0).toFixed(2)}` },
        { key: "freeAbove", label: "Free ≥", align: "right", render: (r) => r.freeAbove ? `€ ${r.freeAbove}` : "—" },
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
