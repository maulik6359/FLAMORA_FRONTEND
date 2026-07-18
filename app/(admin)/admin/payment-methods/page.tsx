"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function PaymentMethodsPage() {
  return (
    <CrudAdmin
      title="Payment Methods"
      eyebrow="Ledger · Settlements"
      endpoint="/payment-methods"
      fields={[
        { name: "name", label: "Display name", required: true, placeholder: "Stripe (Cards)" },
        {
          name: "type",
          label: "Type",
          type: "select",
          required: true,
          options: [
            { value: "card", label: "Card" },
            { value: "wallet", label: "Wallet" },
            { value: "cod", label: "Cash on Delivery" },
            { value: "bank_transfer", label: "Bank Transfer" },
            { value: "crypto", label: "Crypto" },
          ],
        },
        { name: "provider", label: "Provider", placeholder: "stripe, razorpay, paypal…" },
        { name: "sortOrder", label: "Sort order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={[
        { key: "name", label: "Method" },
        { key: "type", label: "Type", render: (r) => <span className="text-[10px] uppercase tracking-wider text-neutral-400">{r.type}</span> },
        { key: "provider", label: "Provider" },
        { key: "sortOrder", label: "Order", align: "right" },
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
