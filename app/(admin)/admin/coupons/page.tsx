"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";
import { formatPrice } from "@/lib/api";

export default function CouponsPage() {
  return (
    <CrudAdmin
      title="Coupons"
      eyebrow="Promo Codes"
      endpoint="/admin/coupons"
      fields={[
        { name: "code", label: "Code", required: true, placeholder: "MAISON10" },
        { name: "discountType", label: "Type", type: "select", required: true, options: [
          { value: "percentage", label: "Percentage" },
          { value: "fixed", label: "Fixed amount" },
        ] },
        { name: "discountValue", label: "Value", type: "number", required: true },
        { name: "minOrderAmount", label: "Min Order", type: "number" },
        { name: "maxDiscountAmount", label: "Max Discount Cap", type: "number" },
        { name: "usageLimit", label: "Usage Limit", type: "number" },
        { name: "expirationDate", label: "Expiration Date", type: "date" },
        { name: "isActive", label: "Active", type: "checkbox" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      ]}
      columns={[
        { key: "code", label: "Code", render: (r) => <span className="font-mono text-gold tracking-[0.2em]">{r.code}</span> },
        { key: "discountType", label: "Type", render: (r) => <span className="capitalize text-neutral-400">{r.discountType}</span> },
        { key: "discountValue", label: "Value", render: (r) => r.discountType === "percentage" ? `${r.discountValue}%` : formatPrice(r.discountValue) },
        { key: "minOrderAmount", label: "Min Order", render: (r) => r.minOrderAmount ? formatPrice(r.minOrderAmount) : "—" },
        { key: "usageCount", label: "Used", render: (r) => `${r.usageCount || 0}${r.usageLimit ? " / " + r.usageLimit : ""}` },
        { key: "expirationDate", label: "Expires", render: (r) => r.expirationDate ? new Date(r.expirationDate).toLocaleDateString() : "—" },
        { key: "isActive", label: "Status", render: (r) => <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${r.isActive ? "bg-emerald-900/50 text-emerald-300" : "bg-neutral-900 text-neutral-500"}`}>{r.isActive ? "Active" : "Off"}</span> },
      ]}
    />
  );
}
