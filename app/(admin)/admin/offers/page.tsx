"use client";
import { CrudAdmin } from "@/components/admin/CrudAdmin";
import { formatPrice } from "@/lib/api";

export default function OffersPage() {
  return (
    <CrudAdmin
      title="Offers"
      eyebrow="Promotions"
      endpoint="/admin/offers"
      fields={[
        { name: "title", label: "Title", required: true, colSpan: 2 },
        { name: "type", label: "Type", type: "select", required: true, options: [
          { value: "flash_sale", label: "Flash Sale" },
          { value: "seasonal", label: "Seasonal" },
          { value: "festival", label: "Festival" },
          { value: "product_discount", label: "Product Discount" },
          { value: "category_discount", label: "Category Discount" },
          { value: "bundle", label: "Bundle" },
        ] },
        { name: "discountType", label: "Discount Type", type: "select", options: [
          { value: "percentage", label: "Percentage" },
          { value: "fixed", label: "Fixed" },
        ] },
        { name: "discountValue", label: "Value", type: "number", required: true },
        { name: "bannerImage", label: "Banner Image URL", type: "url", colSpan: 2 },
        { name: "startDate", label: "Start Date", type: "date" },
        { name: "endDate", label: "End Date", type: "date" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "type", label: "Type", render: (r) => <span className="text-neutral-400 text-xs">{r.type?.replace(/_/g, " ")}</span> },
        { key: "discountValue", label: "Discount", render: (r) => r.discountType === "percentage" ? `${r.discountValue}%` : formatPrice(r.discountValue) },
        { key: "startDate", label: "Starts", render: (r) => r.startDate ? new Date(r.startDate).toLocaleDateString() : "—" },
        { key: "endDate", label: "Ends", render: (r) => r.endDate ? new Date(r.endDate).toLocaleDateString() : "—" },
        { key: "isActive", label: "Status", render: (r) => <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${r.isActive ? "bg-emerald-900/50 text-emerald-300" : "bg-neutral-900 text-neutral-500"}`}>{r.isActive ? "Live" : "Off"}</span> },
      ]}
    />
  );
}
